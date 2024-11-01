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
                displayId: createUsecaseDto.displayId,
                name: createUsecaseDto.name,
                description: createUsecaseDto.description,
                entries: createUsecaseDto.entries,
                preconditions: createUsecaseDto.preconditions,
                postconditions: createUsecaseDto.postconditions,
                projectId: createUsecaseDto.projectId,
            },
        });

        // Crea los flujos principales
        const mainFlows = await Promise.all(
            createUsecaseDto.mainFlow.map(flow =>
                this.prismaService.flow.create({
                    data: {
                        name: flow.name,
                        steps: {
                            create: flow.steps.map(step => ({
                                number: step.number,
                                description: step.description,
                            })),
                        },
                        useCaseMainId: useCase.id, // Asociar con el caso de uso
                    },
                })
            )
        );

        // Crea los flujos alternativos
        const alternateFlows = await Promise.all(
            createUsecaseDto.alternateFlows.map(flow =>
                this.prismaService.flow.create({
                    data: {
                        name: flow.name,
                        steps: {
                            create: flow.steps.map(step => ({
                                number: step.number,
                                description: step.description,
                            })),
                        },
                        useCaseAlternateId: useCase.id, // Asociar con el caso de uso
                    },
                })
            )
        );

        return {
            ...useCase,
            mainFlows,
            alternateFlows,
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

  // async update(id: string, updateUsecaseDto: UpdateUseCaseDto) {
  //   try {
  //     return await this.prismaService.useCase.update({
  //       where: { id }, // Identificador del caso de uso a actualizar
  //       data: {
  //         name: updateUsecaseDto.name,
  //         description: updateUsecaseDto.description,
  //         entries: updateUsecaseDto.entries,
  //         mainFlow: {
  //           connect: updateUsecaseDto.mainFlow.map((flow) => ({ id: flow.id })), // Conecta los flujos principales existentes
  //         },
  //         preconditions: {
  //           set: updateUsecaseDto.preconditions || [], // Asigna las precondiciones (si existen)
  //         },
  //         postconditions: {
  //           set: updateUsecaseDto.postconditions || [], // Asigna las postcondiciones (si existen)
  //         },
  //         projectId: updateUsecaseDto.projectId, // ID del proyecto
  //         alternateFlows: {
  //           connect: updateUsecaseDto.alternateFlows?.map((flow) => ({
  //             id: flow.id,
  //           })), // Conecta los flujos alternativos existentes
  //         },
  //         displayId: updateUsecaseDto.displayId, // ID de visualización
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       // Aquí puedes manejar errores específicos de Prisma
  //       if (error.code === 'P2002') {
  //         throw new ConflictException(
  //           `Use Case with name ${updateUsecaseDto.name} already exists`,
  //         );
  //       }
  //     }
  //     throw error; // Re-lanzar otros errores
  //   }
  // }

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
