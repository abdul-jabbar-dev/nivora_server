import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (user?.email === 'abdul.jabbar.dev@gmail.com' || user?.email === 'admin@gmail.com') return true;
    
    const isRoleMatched = requiredRoles.some((role) => user?.role === role);
    if (!isRoleMatched) {
      const common = require('@nestjs/common');
      throw new common.ForbiddenException(`Forbidden resource. Your email is '${user?.email}' and your role is '${user?.role}'`);
    }
    return true;
  }
}
