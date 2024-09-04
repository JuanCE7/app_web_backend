import { PartialType } from '@nestjs/swagger';
import { CreateTestcaseDto } from './create-testcase.dto';

export class UpdateTestcaseDto extends PartialType(CreateTestcaseDto) {}
