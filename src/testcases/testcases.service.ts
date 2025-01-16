import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UsecasesService } from '../usecases/usecases.service';
import { IaService } from '../ia/ia.service';
@Injectable()
export class TestcasesService {
  constructor(
    private prismaService: PrismaService,
    private readonly usecasesService: UsecasesService,
    private readonly iaService: IaService,
  ) {}

  async generateTestCase(id: string) {
    try {
      const useCase = await this.usecasesService.findOne(id);

      if (!useCase) {
        throw new NotFoundException(`Caso de Uso no encontrado`);
      }

      const cleanResponse = (response: string): string => {
        // Utiliza una expresión regular para extraer el contenido entre `{` y `}`
        const jsonMatch = response.match(/{[\s\S]*}/);
        if (jsonMatch) {
          return jsonMatch[0];
        } else {
          throw new Error(
            'No se encontró un bloque JSON válido en la respuesta',
          );
        }
      };

      const generatedTestCaseText = await this.iaService.getCompletion(useCase);
      const generatedTestCase2 = cleanResponse(generatedTestCaseText);

      const generatedTestCase = JSON.parse(generatedTestCase2);

      if (!generatedTestCase.response) {
        return {
          success: false,
          generatedTestCases: generatedTestCase,
        };
      }

      return {
        success: true,
        generatedTestCases: generatedTestCase,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Caso de prueba funcional del caso de uso ya existe`,
          );
        }
      }

      if (error instanceof SyntaxError) {
        throw new Error(`Error al parsear la respuesta JSON: ${error.message}. 
          Por favor, verifica el formato de la respuesta de la IA.`);
      }

      throw new Error(
        `Error durante la generación del caso de prueba: ${error.message}`,
      );
    }
  }

  async create(createTestCaseDto: CreateTestCaseDto) {
    try {
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
      if (
        createTestCaseDto.explanationSummary &&
        createTestCaseDto.explanationDetails
      ) {
        await this.prismaService.explanation.create({
          data: {
            summary: createTestCaseDto.explanationSummary,
            details: createTestCaseDto.explanationDetails,
            testCaseId: testCase.id, 
          },
        });
      }
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Test Case with name ${createTestCaseDto.name} already exists`,
          );
        }
      }
      throw new InternalServerErrorException(
        'Ocurrió un error mientras se creaba el caso de Prueba Funcional',
      );
    }
  }

  async findAll(useCaseId: string) {
    try {
      const testCases = await this.prismaService.testCase.findMany({
        where: {
          useCaseId: useCaseId,
        },
      });
      return testCases;
    } catch (error) {
      throw new Error("No se han podido recuperar los casos de prueba funcionales");
    }
    
  }

  async findOne(id: string) {
    const testCaseFound = await this.prismaService.testCase.findUnique({
      where: { id: id },
    });
    if (!testCaseFound) {
      throw new NotFoundException(`Caso de Prueba Funcional no encontrado`);
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
        throw new NotFoundException(`Caso de Prueba Funcional no encontrado`);
      }

      return testCaseUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Caso de Prueba Funcional no encontrado`);
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
      throw new NotFoundException(`Caso de Prueba Funcional no encontrado`);
    }

    return deletedTestCase;
  }
}
