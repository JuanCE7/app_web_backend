import { SetMetadata } from '@nestjs/common';
import { Roles as _roles} from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (role: _roles) => SetMetadata(ROLES_KEY, role);