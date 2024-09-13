import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  // Método para crear un nuevo proyecto
  async create(createProjectDto: CreateProjectDto) {
    try {
      // Creamos un nuevo proyecto usando el DTO proporcionado
      return await this.prismaService.project.create({
        data: {
          projectCode: createProjectDto.projectCode,
          name: createProjectDto.name,
          description: createProjectDto.description,
          image: createProjectDto.image,
          creatorId: createProjectDto.creatorId,
          // Se pueden agregar más campos si es necesario
        },
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Project with name ${createProjectDto.name} already exists`,
          );
        }
      }
      throw error;
    }
  }

  // Obtener todos los proyectos
  findAll() {
    return this.prismaService.project.findMany();
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
          projectCode: updateProjectDto.projectCode,
          name: updateProjectDto.name,
          description: updateProjectDto.description,
          image: updateProjectDto.image,
          // Puedes agregar más campos si es necesario
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      throw error;
    }
  }
}
