import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'La contraseña es obligatoria y debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}