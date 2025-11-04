import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'อีเมล' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234', description: 'รหัสผ่าน' })
  @IsOptional()
  @IsString()
  password: string;
}
