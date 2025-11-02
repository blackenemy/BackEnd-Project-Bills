import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { BillLogAction } from '../../common/enum/bill-enum';

export class CreateBillLogDto {
  @ApiProperty({ example: 42, description: 'FK → bills.id' })
  @IsOptional()
  @IsInt()
  billId: number;

  @ApiProperty({
    enum: BillLogAction,
    enumName: 'BillLogAction',
    example: BillLogAction.CREATED,
    description: 'ประเภทของเหตุการณ์',
  })
  @IsEnum(BillLogAction)
  action: BillLogAction;

  @ApiProperty({ example: 7, description: 'หมายเลขสมาชิก' })
  @IsOptional()
  @IsInt()
  userId: number;

  @ApiPropertyOptional({
    example: 'รอดำเนินการ',
    description: 'สถานะเดิม (ถ้ามี)',
  })
  @IsOptional()
  @IsString()
  oldStatus?: string;

  @ApiPropertyOptional({ example: 'ผ่าน', description: 'สถานะใหม่ (ถ้ามี)' })
  @IsOptional()
  @IsString()
  newStatus?: string;

  @ApiProperty({
    example: 'สร้างบิลใหม่',
    description: 'ข้อความหมายเหตุ',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
