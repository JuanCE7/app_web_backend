import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';
import { UserType } from '@prisma/client';

export function Auth(role: UserType) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}
