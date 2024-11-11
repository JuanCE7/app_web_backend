import {
  IsString,
  MinLength,
  IsUUID,
  IsOptional,
} from 'class-validator';
export class CreateTestCaseDto {
  @IsString()
  @MinLength(3)
  code: string;

  @IsString({ message: 'El nombre es obligatorio y debe ser un texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  name: string;

  @IsString({ message: 'La descripción es obligatoria y debe ser un texto.' })
  @MinLength(10, {
    message: 'La descripcion debe tener al menos 10 caracteres.',
  })
  description: string;

  @IsString({
    message: 'Las precondiciones son obligatorias y debe ser un texto.',
  })
  inputData?: string;

  @IsString()
  expectedResult?: string;

  @IsString()
  steps: string;

  @IsUUID()
  useCaseId: string;

  @IsOptional()
  @IsString()
  explanationSummary?: string;

  @IsOptional()
  @IsString()
  explanationDetails?: string;
}
