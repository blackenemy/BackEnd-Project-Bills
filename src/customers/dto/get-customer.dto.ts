import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCustomerDto {
  @ApiProperty({ example: 1, description: 'หน้าที่', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'จำนวนรายการต่อหน้า', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ example: 'สมชาย', description: 'ค้นหาจากชื่อ', required: false })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({ example: 'ใจดี', description: 'ค้นหาจากนามสกุล', required: false })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({ example: 'customer@example.com', description: 'ค้นหาจากอีเมล', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '0812345678', description: 'ค้นหาจากเบอร์โทรศัพท์', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
