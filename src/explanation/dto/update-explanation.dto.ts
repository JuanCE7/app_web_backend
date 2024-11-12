import { PartialType } from '@nestjs/swagger';
import { CreateExplanationDto } from './create-explanation.dto';

export class UpdateExplanationDto extends PartialType(CreateExplanationDto) {}
