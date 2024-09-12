import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IaController } from './ia.controller';
import { IaService } from './ia.service';

@Module({
  imports: [HttpModule],
  controllers: [IaController],
  providers: [IaService],
})
export class IaModule {}