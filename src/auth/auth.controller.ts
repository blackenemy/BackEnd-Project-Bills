import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';
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
  @ApiUnauthorizedResponse({ description: 'ข้อมูลรับรองไม่ถูกต้อง (username/password)' })
  @ApiBadRequestResponse({ description: 'คำขอไม่ถูกต้อง' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'สมัครผู้ใช้' })
  @ApiCreatedResponse({ description: 'สมัครผู้ใช้สำเร็จ' })
  @ApiBadRequestResponse({ description: 'ข้อมูลสมัครไม่ถูกต้อง' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์สร้างผู้ใช้ (ถ้าจำกัดการสร้าง)' })
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
