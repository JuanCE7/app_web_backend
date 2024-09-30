import { Module } from '@nestjs/common';
import { UsecasesService } from './usecases.service';
import { UsecasesController } from './usecases.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UsecasesController],
  providers: [UsecasesService, PrismaService],
  exports: [UsecasesService]
})
export class UsecasesModule {}
