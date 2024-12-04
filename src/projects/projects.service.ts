import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProjectRoles } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ShareProjectDto } from './dto/share-project.dto';
import { ExitProjectDto } from './dto/exit-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      let code;
      let codeExists = true;
      while (codeExists) {
        code = uuidv4().split('-')[0].slice(0, 12);
        codeExists =
          (await this.prismaService.project.findUnique({
            where: { code },
          })) !== null;
      }

      const project = await this.prismaService.project.create({
        data: {
          code,
          name: createProjectDto.name,
          description: createProjectDto.description,
          members: {
            create: {
              userId: createProjectDto.userId,
              role: 'Owner',
            },
          },
        },
        include: {
          members: true,
        },
      });

      return project;
    } catch (error) {
      throw new Error('Error creating project');
    }
  }

  async findAll(userId: string) {
    try {
      const projects = await this.prismaService.projectMember.findMany({
        where: {
          userId,
        },
        include: {
          project: true,
        },
      });
  
      return projects.map((member) => ({
        ...member.project,
        role: member.role,
      }));
    } catch (error) {
      throw new Error("Could not fetch user projects");
    }
  }
  


  async shareProject(shareProjectDto: ShareProjectDto) {
    try {
      // Buscar el proyecto y sus miembros
      const projectFound = await this.prismaService.project.findUnique({
        where: { 
          code: shareProjectDto.code 
        },
        include: {
          members: true
        },
      });

      if (!projectFound) {
        throw new NotFoundException(`Project with code ${shareProjectDto.code} not found`);
      }

      // Verificar si el usuario ya es miembro del proyecto
      const existingMembership = await this.prismaService.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: shareProjectDto.userId,
            projectId: projectFound.id,
          },
        },
      });

      if (existingMembership) {
        // Si ya es miembro, verificar si es Owner
        if (existingMembership.role === ProjectRoles.Owner) {
          throw new ConflictException(`You are already the owner of this project`);
        } else {
          throw new ConflictException(`You are already a member of this project`);
        }
      }

      // Obtener el número actual de miembros
      const memberCount = await this.prismaService.projectMember.count({
        where: {
          projectId: projectFound.id,
        },
      });

      // Establecer un límite máximo de miembros (puedes ajustar este número según tus necesidades)
      const MAX_MEMBERS = 10;
      if (memberCount >= MAX_MEMBERS) {
        throw new ConflictException(`Project has reached the maximum limit of ${MAX_MEMBERS} members`);
      }

      // Crear nuevo miembro usando una transacción
      const newMember = await this.prismaService.$transaction(async (prisma) => {
        // Verificar una última vez antes de crear (evitar race conditions)
        const finalCheck = await prisma.projectMember.findUnique({
          where: {
            userId_projectId: {
              userId: shareProjectDto.userId,
              projectId: projectFound.id,
            },
          },
        });

        if (finalCheck) {
          throw new ConflictException(`You are already a member of this project`);
        }

        // Crear el nuevo miembro
        return await prisma.projectMember.create({
          data: {
            userId: shareProjectDto.userId,
            projectId: projectFound.id,
            role: ProjectRoles.Editor, // Usando el enum del schema
          },
          include: {
            user: {
              select: {
                id: true,
              },
            },
            project: {
              select: {
                id: true,
              },
            },
          },
        });
      });

      return {
        success: true,
        message: 'Successfully joined the project',
        member: newMember,
      };

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 es el código de error para violaciones de unicidad
        if (error.code === 'P2002') {
          throw new ConflictException(`User is already a member of this project`);
        }
        // P2025 es el código de error para registros no encontrados
        if (error.code === 'P2025') {
          throw new NotFoundException(`Project or user not found`);
        }
      }
      
      // Si es uno de nuestros errores personalizados, lo propagamos
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      // Para cualquier otro tipo de error
      throw new InternalServerErrorException('An error occurred while sharing the project');
    }
  }

  async exitProject(exitProjectDto: ExitProjectDto) {
    try {
      // Verificar si la relación existe antes de intentar eliminarla
      const membership = await this.prismaService.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: exitProjectDto.userId,
            projectId: exitProjectDto.projectId,
          },
        },
      });
  
      if (!membership) {
        throw new NotFoundException(`User with id ${exitProjectDto.userId} is not a member of project with id ${exitProjectDto.projectId}`);
      }
  
      // Eliminar la relación en la tabla projectMember
      await this.prismaService.projectMember.delete({
        where: {
          userId_projectId: {
            userId: exitProjectDto.userId,
            projectId: exitProjectDto.projectId,
          },
        },
      });
  
      return {
        success: true,
        message: `User with id ${exitProjectDto.userId} successfully removed from project with id ${exitProjectDto.projectId}`,
      };
    } catch (error) {
      // Manejo de errores de Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Membership not found`);
        }
      }
      throw new InternalServerErrorException('An error occurred while removing the project member');
    }
  }
  
  // Obtener un proyecto por ID
  async findOne(id: string) {
    const projectFound = await this.prismaService.project.findUnique({
      where: { id },
    });
    if (!projectFound) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return projectFound;
  }

  // Actualizar un proyecto existente
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const projectUpdate = await this.prismaService.project.update({
        where: { id },
        data: {
          name: updateProjectDto.name,
          description: updateProjectDto.description,
        },
      });

      if (!projectUpdate) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }

      return projectUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Project with id ${id} not found`);
        }
      }
      throw error;
    }
  }

  // Eliminar un proyecto
  async remove(id: string) {
    try {
      const deletedProject = await this.prismaService.project.delete({
        where: { id },
      });

      if (!deletedProject) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }

      return deletedProject;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      throw error;
    }
  }
}
