import { PartialType } from '@nestjs/mapped-types';
import { CreateUseCaseDto } from './create-usecase.dto';

export class UpdateUseCaseDto extends PartialType(CreateUseCaseDto) {}