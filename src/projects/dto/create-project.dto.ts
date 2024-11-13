import { IsUUID, IsString, IsOptional, IsArray, MinLength, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  description?: string; 

  @IsOptional()
  image?: string; 

  @IsString()
  userId: string;
}
