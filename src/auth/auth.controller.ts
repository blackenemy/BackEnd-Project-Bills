import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/common/guard/local-auth.guard';
import { LoginDto } from './dto/login.dto';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthRequest {
  user: AuthUser;
}

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstname?: string;
  lastname?: string;
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
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: '1234' },
        role: { type: 'string', example: 'user', enum: ['user', 'admin'] },
        firstname: { type: 'string', example: 'สมชาย' },
        lastname: { type: 'string', example: 'ใจดี' },
      },
      required: ['username', 'email', 'password'],
    },
  })
  async register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }
}
