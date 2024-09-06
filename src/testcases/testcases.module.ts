import { Module } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { TestcasesController } from './testcases.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TestcasesController],
  providers: [TestcasesService, PrismaService],
})
export class TestcasesModule {}
