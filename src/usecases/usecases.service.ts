import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUseCaseDto } from './dto/create-usecase.dto';
import { UpdateUseCaseDto } from './dto/update-usecase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsecasesService {
  constructor(private prismaService: PrismaService) {}

  async create(createUsecaseDto: CreateUseCaseDto) {
    try {
      // Primero, crea el caso de uso y almacena la referencia
      const useCase = await this.prismaService.useCase.create({
        data: {
          code: createUsecaseDto.code,
          name: createUsecaseDto.name,
          description: createUsecaseDto.description,
          preconditions: createUsecaseDto.preconditions,
          postconditions: createUsecaseDto.postconditions,
          projectId: createUsecaseDto.projectId,
          mainFlow: createUsecaseDto.mainFlow,
          alternateFlows: createUsecaseDto.alternateFlows
        },
      });

      return {
        ...useCase,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(`Use Case with name ${createUsecaseDto.name} already exists`);
        }
      }
      throw new InternalServerErrorException('An error occurred while creating the use case');
    }
  }

  findAll(projectId: string) {
    return this.prismaService.useCase.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const useCaseFound = await this.prismaService.useCase.findUnique({
      where: { id: id },
    });
    if (!useCaseFound) {
      throw new NotFoundException(`Use Case with id ${id} not found`);
    }

    return useCaseFound;
  }

  // Actualizar un usecase existente
  async update(id: string, updateUseCaseDto: UpdateUseCaseDto) {
    try {
      const useCaseUpdate = await this.prismaService.useCase.update({
        where: { id },
        data: {
          code: updateUseCaseDto.code,
          name: updateUseCaseDto.name,
          description: updateUseCaseDto.description,
          preconditions: updateUseCaseDto.preconditions,
          postconditions: updateUseCaseDto.postconditions,
          mainFlow: updateUseCaseDto.mainFlow,
          alternateFlows: updateUseCaseDto.alternateFlows
        },
      });

      if (!useCaseUpdate) {
        throw new NotFoundException(`UseCase with id ${id} not found`);
      }

      return useCaseUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`UseCase with id ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const deletedUseCase = await this.prismaService.useCase.delete({
      where: { id: id },
    });

    if (!deletedUseCase) {
      throw new NotFoundException(`Use Case with id ${id} not found`);
    }

    return deletedUseCase;
  }
}
