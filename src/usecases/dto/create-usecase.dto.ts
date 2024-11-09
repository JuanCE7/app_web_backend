import { IsString, MinLength, IsArray, IsUUID, IsOptional, IsObject, IsInt } from 'class-validator';
export class CreateUseCaseDto {  
    @IsString()
    @MinLength(3)
    code: string; // ID de visualización
  
    @IsString({ message: 'El nombre es obligatorio y debe ser un texto.' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    name: string; // Breve título que describe el caso de uso
  
    @IsString({ message: 'La descripción es obligatoria y debe ser un texto.' })
    @MinLength(10, { message: 'La descripcion debe tener al menos 10 caracteres.' })
    description: string; // Detalle del propósito del caso de uso
    
    @IsString({ message: 'Las precondiciones son obligatorias y debe ser un texto.' })
    preconditions?: string; // Condiciones que deben cumplirse antes de ejecutar el caso de uso
  
    @IsString()
    postconditions?: string; // Resultado esperado después de ejecutar el caso de uso
  
    @IsString()
    mainFlow: string; // Pasos clave que describe el flujo principal del caso de uso
  
    @IsString() // Asegúrate de que sea un array de flujos
    @IsOptional()
    alternateFlows?: string; // Flujos alternativos que se desvían del flujo principal
  
    @IsUUID()
    projectId: string; // ID del proyecto al que pertenece este caso de uso
}
