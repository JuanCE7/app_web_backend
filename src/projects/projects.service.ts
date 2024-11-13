import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      // Generar un código único para el proyecto
      let code;
      let codeExists = true;
      while (codeExists) {
        code = uuidv4().split('-')[0].slice(0, 8);
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
          image: createProjectDto.image || '',
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
      console.error(error);
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
  
      return projects.map(member => member.project);
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw new Error('Could not fetch user projects');
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
          image: updateProjectDto.image,
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
