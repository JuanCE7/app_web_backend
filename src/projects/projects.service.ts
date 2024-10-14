import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
      
      let projectCode;
      let codeExists = true;
  
      while (codeExists) {
        projectCode = uuidv4().split('-')[0].slice(0, 8);
        codeExists = await this.prismaService.project.findUnique({
          where: { projectCode },
        }) !== null;
      }  
      return await this.prismaService.project.create({
        data: {
          projectCode, 
          name: createProjectDto.name,
          description: createProjectDto.description,
          image: createProjectDto.image,
          creator: {
            connect: { id: createProjectDto.creatorId },
          },
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      throw error;
    }
  }
}
