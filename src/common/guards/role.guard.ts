import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorators/role.decorator';
import AppError from '../errors/AppError';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/database/entities';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

    const hasRequiredRole = userRoles.some((role) =>
      requiredRoles.includes(role),
    );

    if (!hasRequiredRole) {
      throw new AppError(
        'Forbidden: Insufficient permissions',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
