import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ExitProjectDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}