import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExplanationDto } from './dto/create-explanation.dto';
import { UpdateExplanationDto } from './dto/update-explanation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExplanationService {
  constructor(
    private prismaService: PrismaService,
  ) {}
  // create(createExplanationDto: CreateExplanationDto) {
  //   return 'This action adds a new explanation';
  // }

  // findAll() {
  //   return `This action returns all explanation`;
  // }

  async findOne(testCaseId: string) {
    const explanationFound = await this.prismaService.explanation.findUnique({
      where: { testCaseId: testCaseId },
    });
    if (!explanationFound) {
      throw new NotFoundException(`Test Case with id ${testCaseId} not found`);
    }

    return explanationFound;
  }

  // update(id: number, updateExplanationDto: UpdateExplanationDto) {
  //   return `This action updates a #${id} explanation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} explanation`;
  // }
}
