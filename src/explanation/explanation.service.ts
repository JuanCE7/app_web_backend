import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExplanationService {
  constructor(private prismaService: PrismaService) {}

  async findOne(testCaseId: string) {
    const explanationFound = await this.prismaService.explanation.findUnique({
      where: { testCaseId: testCaseId },
    });
    if (!explanationFound) {
      throw new NotFoundException(`Explicación no encontrada`);
    }
    return explanationFound;
  }
}
