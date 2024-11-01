import { Roles } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'El nombre es obligatorio y debe ser un texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  firstName: string;

  @IsString({ message: 'El apellido es obligatorio y debe ser un texto.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  lastName: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'La contraseña es obligatoria y debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
