import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/common/guard/local-auth.guard';
import { LoginDto } from './dto/login.dto';

interface AuthUser {
  id: string;
  username: string;
  role: string;
}

interface AuthRequest {
  user: AuthUser;
}

interface RegisterBody {
  username: string;
  password: string;
  role?: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'ล็อกอิน' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'สมัครผู้ใช้' })
  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'newuser' },
        password: { type: 'string', example: '1234' },
        role: { type: 'string', example: 'user', enum: ['user', 'admin'] },
        firstName: { type: 'string', example: 'สมชาย' },
        lastName: { type: 'string', example: 'ใจดี' },
      },
      required: ['username', 'password'],
    },
  })
  async register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }
}
