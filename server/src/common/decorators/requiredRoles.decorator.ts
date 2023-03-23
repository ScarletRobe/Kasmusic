import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../user/enums';

export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
