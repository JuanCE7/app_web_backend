import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUseCaseDto } from './dto/create-usecase.dto';
import { UpdateUseCaseDto } from './dto/update-usecase.dto';
import { PrismaService } from '../prisma/prisma.service';
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
          alternateFlows: createUsecaseDto.alternateFlows,
        },
      });

      return {
        ...useCase,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Caso de Uso ${createUsecaseDto.name} ya existe`,
          );
        }
      }
      throw new InternalServerErrorException(
        'Ocurrio un error mientras se creaba el caso de uso',
      );
    }
  }

  findAll(projectId: string) {
    return this.prismaService.useCase.findMany({
      where: {
        projectId: projectId,
      },
    });
  }

  async findOne(id: string) {
    const useCaseFound = await this.prismaService.useCase.findUnique({
      where: { id: id },
    });
    if (!useCaseFound) {
      throw new NotFoundException(`Caso de Uso no encontrado`);
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
          alternateFlows: updateUseCaseDto.alternateFlows,
        },
      });

      if (!useCaseUpdate) {
        throw new NotFoundException(`Caso de Uso no encontrado`);
      }

      return useCaseUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Caso de Uso no encontrado`);
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
      throw new NotFoundException(`Caso de Uso no encontrado`);
    }
    return deletedUseCase;
  }
}
