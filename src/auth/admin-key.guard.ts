import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminKey = request.headers['x-admin-secret'];

    // In a real app, this should be an environment variable.
    // For this implementation, we use a hardcoded token matching our frontend actions.
    if (adminKey === 'admin_secret_12345') {
      return true;
    }

    throw new UnauthorizedException('Invalid Admin Key');
  }
}
