import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUseCaseDto } from 'src/usecases/dto/create-usecase.dto';
import { UsecasesService } from 'src/usecases/usecases.service';
import { IaService } from 'src/ia/ia.service';
@Injectable()
export class TestcasesService {
  constructor(
    private prismaService: PrismaService,
    private readonly usecasesService: UsecasesService,
    private readonly iaService: IaService,
  ) {}

  async create(id: string) {
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
      // console.log("hola",generatedTestCase2[1]);
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

      // Iterar sobre todos los casos de prueba generados
      for (const testCaseData of generatedTestCase.testCases) {
        // Verificar que lstInputs sea del tipo esperado (array o similar)
        const inputDataArray = Array.isArray(testCaseData.lstInputs)
          ? testCaseData.lstInputs
          : Object.keys(testCaseData.lstInputs).map(
              (key) => `${key}: ${testCaseData.lstInputs[key]}`,
            );

        // Crear cada test case en la base de datos usando Prisma
        await this.prismaService.testCase.create({
          data: {
            code: testCaseData.strId,
            name: testCaseData.strDescription,
            steps: testCaseData.strSteps,
            description: testCaseData.strDescription,
            inputData: inputDataArray, 
            expectedResult: JSON.stringify(testCaseData.lstPreconditions), // Igual con las precondiciones si es necesario
            projectId: useCase.projectId,
          },
        });
      }
      return {
        message: 'Todos los casos de prueba se han creado exitosamente.',
      };

      // return generatedTestCase;
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
      throw new Error('Error while creating TestCase: ' + error.message);
    }
  }

  findAll() {
    return this.prismaService.testCase.findMany();
  }

  async findOne(id: string) {
    const testCaseFound = await this.prismaService.testCase.findUnique({
      where: { id: id },
    });
    if (!testCaseFound) {
      throw new NotFoundException(`TestCase with id ${id} not found`);
    }

    return testCaseFound;
  }

  async update(id: string, updateTestcaseDto: UpdateTestCaseDto) {
    const testCaseUpdate = await this.prismaService.testCase.update({
      where: {
        id: id,
      },
      data: updateTestcaseDto,
    });

    if (!testCaseUpdate) {
      throw new NotFoundException(`TestCase with id ${id} not found`);
    }

    return testCaseUpdate;
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
