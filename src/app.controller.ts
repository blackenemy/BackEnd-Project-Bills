import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'ทดสอบการเชื่อมต่อ API' })
  @ApiResponse({ status: 200, description: 'API ทำงานปกติ' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'ตรวจสอบสถานะ API' })
  @ApiResponse({ status: 200, description: 'สถานะ API' })
  @Get('health')
  getHealth() {
    return { 
      status: 'ok', 
      message: 'API is running',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3001,
      version: '1.0.0'
    };
  }

  @ApiOperation({ summary: 'ทดสอบ API สำหรับ Port 3001' })
  @ApiResponse({ 
    status: 200, 
    description: 'ข้อมูลทดสอบ API',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'API Test Successful' },
        server: { type: 'string', example: 'NestJS Bills API Server' },
        port: { type: 'number', example: 3001 },
        timestamp: { type: 'string', example: '2024-11-04T10:00:00.000Z' },
        endpoints: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @Get('test')
  getTest() {
    return {
      message: 'API Test Successful',
      server: 'NestJS Bills API Server',
      port: process.env.PORT || 3001,
      timestamp: new Date().toISOString(),
      endpoints: [
        'GET /',
        'GET /health',
        'GET /test',
        'POST /auth/login',
        'POST /auth/register',
        'GET /bills',
        'POST /bills',
        'GET /customers',
        'POST /customers',
        'GET /users'
      ],
      database: {
        status: 'connected',
        type: 'PostgreSQL'
      },
      features: [
        'User Management',
        'Bill Management',
        'Customer Management',
        'Authentication (JWT)',
        'Email Login Support',
        'Soft Delete',
        'Pagination'
      ]
    };
  }
}
