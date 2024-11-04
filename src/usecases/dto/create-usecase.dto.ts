import { Flow } from '@prisma/client';
import { IsString, MinLength, IsArray, IsUUID, IsOptional, IsObject, IsInt } from 'class-validator';

export class CreateStepDto {
    @IsInt()
    number: number;

    @IsString()
    description: string;
}

class CreateFlowDto {
    @IsString()
    name: string;

    @IsArray()
    @IsObject({ each: true })
    steps: CreateStepDto[]; // Asegúrate de que este sea un array de objetos de pasos
}

export class CreateUseCaseDto {  
    @IsString()
    @MinLength(3)
    displayId: string; // ID de visualización
  
    @IsString({ message: 'El nombre es obligatorio y debe ser un texto.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    name: string; // Breve título que describe el caso de uso
  
    @IsString({ message: 'La descripción es obligatoria y debe ser un texto.' })
    @MinLength(10, { message: 'El nombre debe tener al menos 10 caracteres.' })
    description: string; // Detalle del propósito del caso de uso
  
    @IsArray({ message: 'Las entradas son obligatorias y debe ser un texto.' })
    entries: string[]; // Datos de entrada que el sistema debe procesar
  
    @IsArray({ message: 'Las precondiciones son obligatorias y debe ser un texto.' })
    preconditions?: string[]; // Condiciones que deben cumplirse antes de ejecutar el caso de uso
  
    @IsArray()
    postconditions?: string[]; // Resultado esperado después de ejecutar el caso de uso
  
    @IsObject({ each: true })
    mainFlow: CreateFlowDto; // Pasos clave que describe el flujo principal del caso de uso
  
    @IsArray() // Asegúrate de que sea un array de flujos
    @IsOptional()
    alternateFlows?: CreateFlowDto[]; // Flujos alternativos que se desvían del flujo principal
  
    @IsUUID()
    projectId: string; // ID del proyecto al que pertenece este caso de uso
}
