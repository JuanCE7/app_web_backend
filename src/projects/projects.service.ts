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
      throw new Error('Error creando el proyecto');
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
      throw new Error("No se han podido recuperar los proyectos del usuario");
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
        throw new NotFoundException(`Proyecto con código ${shareProjectDto.code} no encontrado`);
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
          throw new ConflictException(`Usted ya es el propietario de este proyecto`);
        } else {
          throw new ConflictException(`Usted ya es miembro de este proyecto`);
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
        throw new ConflictException(`El proyecto ha alcanzado el límite máximo de ${MAX_MEMBERS} miembros`);
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
          throw new ConflictException(`Ya es miembro de este proyecto`);
        }

        // Crear el nuevo miembro
        return await prisma.projectMember.create({
          data: {
            userId: shareProjectDto.userId,
            projectId: projectFound.id,
            role: ProjectRoles.Editor,
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
        message: 'Se ha incorporado con éxito al proyecto',
        member: newMember,
      };

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`El usuario ya es miembro de este proyecto`);
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`Proyecto o usuario no encontrado`);
        }
      }
      
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Se ha producido un error al compartir el proyecto');
    }
  }

  async exitProject(exitProjectDto: ExitProjectDto) {
    try {
      const membership = await this.prismaService.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: exitProjectDto.userId,
            projectId: exitProjectDto.projectId,
          },
        },
      });
  
      if (!membership) {
        throw new NotFoundException(`El usuario con id ${exitProjectDto.userId} no es miembro del proyecto con id ${exitProjectDto.projectId}.`);
      }
  
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
        message: `Usuario con id ${exitProjectDto.userId} eliminado correctamente del proyecto con id ${exitProjectDto.projectId}`,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Miembro no encontrado`);
        }
      }
      throw new InternalServerErrorException('Se ha producido un error al eliminar el miembro del proyecto');
    }
  }
  
  async findOne(id: string) {
    const projectFound = await this.prismaService.project.findUnique({
      where: { id },
    });
    if (!projectFound) {
      throw new NotFoundException(`Proyecto no encontrado`);
    }
    return projectFound;
  }

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
        throw new NotFoundException(`Proyecto no encontrado`);
      }

      return projectUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Proyecto no encontrado`);
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
        throw new NotFoundException(`Proyecto no encontrado`);
      }

      return deletedProject;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Proyecto no encontrado`);
      }
      throw error;
    }
  }
}
