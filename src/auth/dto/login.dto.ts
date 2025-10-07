import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'ชื่อผู้ใช้' })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ example: '1234', description: 'รหัสผ่าน' })
  @IsOptional()
  @IsString()
  password: string;
}
