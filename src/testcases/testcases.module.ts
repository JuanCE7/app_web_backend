import { Module } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { TestcasesController } from './testcases.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsecasesService } from 'src/usecases/usecases.service';
import { IaService } from 'src/ia/ia.service';
import { UsecasesModule } from 'src/usecases/usecases.module';

@Module({
  imports: [UsecasesModule],
  controllers: [TestcasesController],
  providers: [TestcasesService, PrismaService, IaService],
})
export class TestcasesModule {}
