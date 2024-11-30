import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExplanationDto } from './dto/create-explanation.dto';
import { UpdateExplanationDto } from './dto/update-explanation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExplanationService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async findOne(testCaseId: string) {
    const explanationFound = await this.prismaService.explanation.findUnique({
      where: { testCaseId: testCaseId },
    });
    if (!explanationFound) {
      throw new NotFoundException(`Test Case with id ${testCaseId} not found`);
    }
    return explanationFound;
  }

}
