// src/common/guards/api-key.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.header('X-API-KEY');
    const validKeys = [
      process.env.X_API_KEY,
    ].filter(Boolean);

    if (!apiKey || !validKeys.includes(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
