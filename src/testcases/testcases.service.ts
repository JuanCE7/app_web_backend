import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UsecasesService } from 'src/usecases/usecases.service';
import { IaService } from 'src/ia/ia.service';
@Injectable()
export class TestcasesService {
  constructor(
    private prismaService: PrismaService,
    private readonly usecasesService: UsecasesService,
    private readonly iaService: IaService,
  ) {}

  async generateTestCase(id: string) {
    try {
      console.log(id);
      const useCase = await this.usecasesService.findOne(id);
      if (!useCase) {
        throw new NotFoundException(`UseCase with id ${id} not found`);
      }

      const generatedTestCaseText = await this.iaService.getCompletion(useCase);
      const generatedTestCase2 = generatedTestCaseText
        .replace(/^```json/, '')
        .replace(/```$/, '');
      console.log('Texto limpio:', generatedTestCase2); // Muestra el texto limpio

      // Parsear el texto plano generado a JSON
      const generatedTestCase = JSON.parse(generatedTestCase2);

      if (
        !generatedTestCase ||
        !generatedTestCase.testCases ||
        generatedTestCase.testCases.length === 0
      ) {
        throw new Error(
          'No se encontraron casos de prueba generados en la respuesta.',
        );
      }

      // Retornar los casos de prueba generados sin guardarlos
      return {
        generatedTestCases: generatedTestCase.testCases, // Solo devolvemos los casos generados
      };
    } catch (error) {
      console.error(error);

      // Manejar errores de Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `TestCase for UseCase with id ${id} already exists`,
          );
        }
      }

      // Re-lanzar el error si es otro
      throw new Error('Error while generating TestCase: ' + error.message);
    }
  }

  async create(createTestCaseDto: CreateTestCaseDto) {
    try {
      // Primero, creamos el TestCase
      const testCase = await this.prismaService.testCase.create({
        data: {
          code: createTestCaseDto.code,
          name: createTestCaseDto.name,
          description: createTestCaseDto.description,
          steps: createTestCaseDto.steps,
          inputData: createTestCaseDto.inputData,
          expectedResult: createTestCaseDto.expectedResult,
          useCaseId: createTestCaseDto.useCaseId,
        },
      });

      // Si se proporciona una explicación, creamos también la Explanation
      if (
        createTestCaseDto.explanationSummary &&
        createTestCaseDto.explanationDetails
      ) {
        await this.prismaService.explanation.create({
          data: {
            summary: createTestCaseDto.explanationSummary,
            details: createTestCaseDto.explanationDetails,
            testCaseId: testCase.id, // Relacionamos la explicación con el TestCase recién creado
          },
        });
      }

      // Devuelve el TestCase creado (incluyendo la posible Explanation asociada)
      return {
        ...testCase,
        explanation: createTestCaseDto.explanationSummary
          ? {
              summary: createTestCaseDto.explanationSummary,
              details: createTestCaseDto.explanationDetails,
            }
          : null,
      };
    } catch (error) {
      console.log(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Conflicto de clave única (ej., si el nombre del TestCase ya existe)
          throw new ConflictException(
            `Test Case with name ${createTestCaseDto.name} already exists`,
          );
        }
      }

      // En caso de cualquier otro error, lanzamos una excepción genérica
      throw new InternalServerErrorException(
        'An error occurred while creating the TestCase',
      );
    }
  }

  findAll(useCaseId: string) {
    return this.prismaService.testCase.findMany({
      where: {
        useCaseId: useCaseId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const testCaseFound = await this.prismaService.testCase.findUnique({
      where: { id: id },
    });
    if (!testCaseFound) {
      throw new NotFoundException(`Test Case with id ${id} not found`);
    }

    return testCaseFound;
  }

  // Actualizar un testCase existente
  async update(id: string, updateTestCaseDto: UpdateTestCaseDto) {
    try {
      const testCaseUpdate = await this.prismaService.testCase.update({
        where: { id },
        data: {
          code: updateTestCaseDto.code,
          name: updateTestCaseDto.name,
          description: updateTestCaseDto.description,
          inputData: updateTestCaseDto.inputData,
          expectedResult: updateTestCaseDto.expectedResult,
          steps: updateTestCaseDto.steps,
        },
      });

      if (!testCaseUpdate) {
        throw new NotFoundException(`TestCase with id ${id} not found`);
      }

      return testCaseUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`TestCase with id ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const deletedTestCase = await this.prismaService.testCase.delete({
      where: { id: id },
    });

    if (!deletedTestCase) {
      throw new NotFoundException(`TestCase with id ${id} not found`);
    }

    return deletedTestCase;
  }
}
