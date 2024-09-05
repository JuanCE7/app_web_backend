import { Permission } from '@prisma/client'

export type CreatePermissionDto = Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>

