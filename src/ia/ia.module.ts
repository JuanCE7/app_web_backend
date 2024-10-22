import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { UsecasesService } from 'src/usecases/usecases.service';
import { UsecasesModule } from 'src/usecases/usecases.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsecasesModule],
  providers: [PrismaService, IaService, UsecasesService],
  exports: [IaService]
})
export class IaModule {}