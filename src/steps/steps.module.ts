import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StepsController],
  providers: [StepsService,PrismaService],
})
export class StepsModule {}
