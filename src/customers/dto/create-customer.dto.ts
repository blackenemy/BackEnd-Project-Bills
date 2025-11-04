import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'สมชาย', description: 'ชื่อ' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'ใจดี', description: 'นามสกุล' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'customer@example.com', description: 'อีเมล' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0812345678', description: 'เบอร์โทรศัพท์' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 ถนนสุขุมวิท กรุงเทพฯ 10110', description: 'ที่อยู่' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'เงินสด', description: 'วิธีการชำระเงิน' })
  @IsOptional()
  @IsString()
  payment?: string;

  @ApiProperty({ example: 'กสิกรไทย', description: 'ธนาคาร' })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty({ example: '1234567890', description: 'เลขบัญชี' })
  @IsOptional()
  @IsString()
  account?: string;
}
