import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from '../types';
import { ROLES_KEY } from '../common/roles.decorator';

@Injectable()
export class PermitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new NotFoundException('User not found');
    }

    return requiredRoles.includes(request.user.role);
  }
}
