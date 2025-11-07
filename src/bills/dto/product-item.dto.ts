import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductItemDto {
  @ApiProperty({ description: 'ชื่อสินค้า' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ราคาต่อหน่วย' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'จำนวน' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
