// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    // ต้อง select password ด้วย (เพราะ entity ซ่อน select)
    const user = await this.userRepo.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'role'],
    });
    if (!user) return null;

    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;

    // ไม่คืน password ออกไป
    const { password, ...safe } = user;
    return safe;
  }

  async login(user: { id: string; username: string; role: string }) {
    const payload = { id: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  async register(data: { username: string; password: string; role?: string }) {
    const existed = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (existed) throw new UnauthorizedException('Username already exists');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepo.create({
      username: data.username,
      password: hashed,
      role: (data.role as any) ?? 'user',
    });
    const saved = await this.userRepo.save(user);
    const { password, ...safe } = saved;
    return safe;
  }
}
