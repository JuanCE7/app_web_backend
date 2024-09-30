import { IsUUID, IsString, IsOptional, IsArray, MinLength, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  projectCode: string; // Código único del proyecto

  @IsString()
  @MinLength(3)
  name: string; // Nombre del proyecto

  @IsString()
  description?: string; // Descripción opcional del proyecto

  @IsUrl()
  @IsOptional()
  image?: string; // Imagen del proyecto

  @IsUUID()
  creatorId: string; // ID del creador del proyecto

  @IsArray()
  @IsOptional() // El proyecto puede no tener casos de uso al crearse
  useCases?: string[]; // IDs de los casos de uso asociados (opcional)

  @IsArray()
  @IsOptional() // El proyecto puede no tener casos de prueba al crearse
  testCases?: string[]; // IDs de los casos de prueba asociados (opcional)

  @IsArray()
  @IsOptional() // El proyecto puede no tener permisos asociados al inicio
  permissions?: string[]; // IDs de los permisos asociados (opcional)
}
