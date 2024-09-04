import { Module } from '@nestjs/common';
import { UsecasesService } from './usecases.service';
import { UsecasesController } from './usecases.controller';

@Module({
  controllers: [UsecasesController],
  providers: [UsecasesService],
})
export class UsecasesModule {}
