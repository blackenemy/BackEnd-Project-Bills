// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1) read @Roles() metadata
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      // no roles required → allow
      return true;
    }

    // 2) get the user from request (populated by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // 3) check if user's role is in the list
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(
      `User role "${user.role}" does not have access`,
    );
  }
}
