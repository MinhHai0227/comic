import { SetMetadata } from '@nestjs/common';
import { userRole } from '@prisma/client';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: [userRole, ...userRole[]]) =>
  SetMetadata(ROLE_KEY, roles);
