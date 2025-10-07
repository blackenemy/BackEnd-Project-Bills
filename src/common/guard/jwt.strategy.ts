import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; username: string; role: string }) {
    // ค่าที่ return จะเป็น req.user สำหรับ route ที่ใช้ JwtAuthGuard
    return payload;
  }
}
