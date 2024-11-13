import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ShareProjectDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}