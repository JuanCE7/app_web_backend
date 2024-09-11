import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean{
    const userType = this.reflector.getAllAndOverride('roles',[
      context.getHandler(),
      context.getClass(),
    ])
    if (!userType) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return user.userType === userType;
  }
}
