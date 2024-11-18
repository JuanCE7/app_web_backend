import { Roles } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // Campos para la entidad
  @IsString({ message: 'El nombre es obligatorio y debe ser un texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  firstName: string;

  @IsString({ message: 'El apellido es obligatorio y debe ser un texto.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  lastName: string;

  // Campos para el usuario
  @IsOptional()
  image?: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'La contraseña es obligatoria y debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsString({ message: 'El rol es obligatorio.' })
  role: Roles;

  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano.' })
  status?: boolean;
}
