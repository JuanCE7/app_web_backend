import { PartialType } from '@nestjs/swagger';
import { CreateUsecaseDto } from './create-usecase.dto';

export class UpdateUsecaseDto extends PartialType(CreateUsecaseDto) {}
