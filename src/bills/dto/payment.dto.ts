import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PaymentBillItemDto {
  @ApiProperty({ example: 'สินค้า A', description: 'ชื่อรายการ' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 150.00, description: 'ราคาต่อหน่วย' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 2, description: 'จำนวน' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class PaymentDetailsDto {
  @ApiProperty({ example: 'เงินสด', description: 'ประเภทการชำระ (เงินสด, โอน, เช็ค)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: new Date(), description: 'วันที่ชำระ' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ type: [PaymentBillItemDto], description: 'รายการบิลที่ชำระ' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentBillItemDto)
  bills: PaymentBillItemDto[];
}

export class PaymentDto {
  @ApiProperty({ example: 'สมชาย ใจดี', description: 'ชื่อลูกค้าที่ชำระ' })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({ example: 1500.00, description: 'จำนวนเงินที่ชำระ' })
  @IsNotEmpty()
  @IsNumber()
  payment: number;

  @ApiProperty({ type: PaymentDetailsDto, description: 'รายละเอียดการชำระ' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  details: PaymentDetailsDto;
}
