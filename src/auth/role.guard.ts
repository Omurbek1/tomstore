import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT-пользователь из запроса

    console.log('Пользователь из запроса:', user); // Логируем пользователя

    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Доступ запрещен');
    }

    return true;
  }
}
