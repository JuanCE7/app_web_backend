import { IsString, MinLength, IsArray, IsUUID, IsOptional } from 'class-validator';

export class CreateUseCaseDto {  
    @IsString()
    @MinLength(3)
    displayId: string; // ID de visualización
  
    @IsString()
    @MinLength(3)
    name: string; // Breve título que describe el caso de uso
  
    @IsString()
    @MinLength(10)
    description: string; // Detalle del propósito del caso de uso
  
    @IsArray()
    entries: string[]; // Datos de entrada que el sistema debe procesar
  
    @IsArray()
    preconditions?: string[]; // Condiciones que deben cumplirse antes de ejecutar el caso de uso
  
    @IsArray()
    postconditions?: string[]; // Resultado esperado después de ejecutar el caso de uso
  
    @IsArray()
    mainFlow: string[]; // Pasos clave que describe el flujo principal del caso de uso
  
    @IsArray()
    alternateFlows?: string[]; // Flujos alternativos que se desvían del flujo principal
  
    @IsUUID()
    projectId: string; // ID del proyecto al que pertenece este caso de uso
}