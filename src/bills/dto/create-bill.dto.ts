import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { statusEnum } from 'src/common/enum/status-enum';

export class CreateBillDto {
  @ApiProperty({ example: 'รายชื่อสินค้า', description: 'ชื่อบิล/สินค้า' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'ค่าใช้จ่ายของสินค้าทั้งหมด',
    description: 'รายละเอียดเพิ่มเติมของบิล',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '1250.50', description: 'จำนวนเงิน' })
  @IsOptional()
  @IsString()
  amount: string;

  @ApiProperty({
    enum: statusEnum,
    enumName: 'BillStatus',
    example: statusEnum.PENDING,
    description: 'สถานะเริ่มต้นของบิล',
  })
  @IsOptional()
  @IsEnum(statusEnum)
  status: statusEnum;

  
}
