import { IsString, MinLength, IsUUID, IsOptional } from 'class-validator';
export class CreateExplanationDto {
  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  details?: string;
}
