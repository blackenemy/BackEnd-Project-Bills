import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { statusEnum } from 'src/common/enum/status-enum';
import { ProductItemDto } from './product-item.dto';

export class CreateBillDto {
  @ApiProperty({ example: 'ใบเสร็จ', description: 'ประเภทบิล' })
  @IsNotEmpty()
  @IsString()
  type_bill: string;

  @ApiProperty({ example: 'บิลเดือนพฤศจิกายน', description: 'ชื่อบิล' })
  @IsNotEmpty()
  @IsString()
  name_bill: string;

  @ApiProperty({ example: 'สมชาย', description: 'ชื่อลูกค้า' })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({ example: new Date(), description: 'วันที่ออกบิล' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ type: [ProductItemDto], description: 'รายการสินค้า' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[];

  @ApiProperty({ example: 5, description: 'จำนวนสินค้ารวม' })
  @IsNotEmpty()
  @IsNumber()
  sum_amount: number;

  @ApiProperty({ example: 1250.50, description: 'ยอดรวมทั้งหมด' })
  @IsNotEmpty()
  @IsNumber()
  sum_total: number;

  @ApiProperty({
    enum: statusEnum,
    enumName: 'BillStatus',
    example: statusEnum.DRAFT,
    description: 'สถานะของบิล',
  })
  @IsOptional()
  @IsEnum(statusEnum)
  status?: statusEnum;

  
}
