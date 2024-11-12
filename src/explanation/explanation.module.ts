import { Module } from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { ExplanationController } from './explanation.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExplanationController],
  providers: [ExplanationService, PrismaService],
})
export class ExplanationModule {}
