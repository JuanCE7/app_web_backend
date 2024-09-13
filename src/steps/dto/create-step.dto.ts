import { IsUUID, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateStepDto {
  @IsInt()
  @Min(1) // El número debe ser mayor o igual a 1
  number: number;

  @IsString()
  description: string; // Descripción del paso

  @IsUUID()
  testCaseId: string; // ID del caso de prueba al que pertenece este paso
}
