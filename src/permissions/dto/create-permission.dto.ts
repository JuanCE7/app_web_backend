import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { PermissionType } from '@prisma/client';

export class CreatePermissionDto {
  @IsEnum(PermissionType) // Valida que el valor sea uno de los tipos enumerados de PermissionType
  permissionType: PermissionType;

  @IsUUID()
  userId: string; // ID del usuario asociado con el permiso

  @IsUUID()
  projectId: string; // ID del proyecto asociado con el permiso
}
