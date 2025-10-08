import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/common/guard/local-auth.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Request } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'ล็อกอิน' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto }) // ให้ Scalar/Swagger แสดง body example
  async login(@Request() req) {
    // req.user มาจาก LocalStrategy.validate()
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
      },
      required: ['username', 'password'],
    },
  })
  async register(@Body() body: any) {
    return this.authService.register(body);
  }
}
