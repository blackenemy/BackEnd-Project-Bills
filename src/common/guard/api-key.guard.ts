// src/common/guards/api-key.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.header('X-API-KEY');
    const validKeys: string[] = [process.env.X_API_KEY ?? ''].filter(Boolean);
    if (!apiKey || !validKeys.includes(apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
