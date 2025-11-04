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
import { statusEnum } from 'src/common/enum/status-enum';

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
    example: statusEnum.PENDING,
    description: 'สถานะเดิม (ถ้ามี)',
  })
  @IsOptional()
  @IsEnum(statusEnum)
  oldStatus?: statusEnum;

  @ApiPropertyOptional({
    example: statusEnum.APPROVED,
    description: 'สถานะใหม่ (ถ้ามี)',
  })
  @IsOptional()
  @IsEnum(statusEnum)
  newStatus?: statusEnum;

  @ApiProperty({
    example: 'สร้างบิลใหม่',
    description: 'ข้อความหมายเหตุ',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
