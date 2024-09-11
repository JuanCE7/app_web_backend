import { UserType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength,IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserType)
  userType: UserType;
}