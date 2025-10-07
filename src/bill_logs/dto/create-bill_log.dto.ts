import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { BillLogAction } from 'src/common/enum/bill-enum';

export class CreateBillLogDto {
  @ApiProperty({ example: 42, description: 'FK → bills.id' })
  @IsOptional()
  @IsInt()
  bill_Id: number;

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
  user_Id?: string;

  @ApiPropertyOptional({
    example: 'รอดำเนินการ',
    description: 'สถานะเดิม (ถ้ามี)',
  })
  @IsOptional()
  @IsString()
  old_status?: string;

  @ApiPropertyOptional({ example: 'ผ่าน', description: 'สถานะใหม่ (ถ้ามี)' })
  @IsOptional()
  @IsString()
  new_status?: string;

  @ApiProperty({
    example: 'สร้างบิลใหม่',
    description: 'ข้อความหมายเหตุ',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
