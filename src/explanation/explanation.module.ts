import { Module } from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { ExplanationController } from './explanation.controller';

@Module({
  controllers: [ExplanationController],
  providers: [ExplanationService],
})
export class ExplanationModule {}
