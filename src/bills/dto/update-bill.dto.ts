import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create-bill.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { PaymentDto } from './payment.dto';

export class UpdateBillDto extends PartialType(CreateBillDto) {
  @ApiProperty({
    type: PaymentDto,
    description: 'ข้อมูลการชำระเงิน (สำหรับการอัปเดต)',
    required: false,
    example: {
      customer_name: 'สมชาย ใจดี',
      payment: 1500.00,
      details: {
        type: 'โอนเงิน',
        date: new Date(),
        bills: [
          {
            name: 'สินค้า B',
            price: 200.00,
            amount: 1
          }
        ]
      }
    }
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDto)
  payment?: PaymentDto;
}
