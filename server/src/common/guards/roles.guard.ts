import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/requiredRoles.decorator';
import { Roles } from './../../user/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const [req] = context.getArgs();
    const roles = req?.user?.roles || [];
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const hasAllRequiredRoles = requiredRoles.every((reqRole) =>
      roles.includes(reqRole),
    );

    if (!requiredRoles.length || hasAllRequiredRoles) {
      return true;
    }

    throw new ForbiddenException("You don't have necessary permissions");
  }
}
