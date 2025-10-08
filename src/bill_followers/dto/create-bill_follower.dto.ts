import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateBillFollowerDto {
  @ApiProperty({ example: 10, description: 'ไอดีของบิลที่จะติดตาม' })
  @IsInt()
  @Min(1)
  billId: number;
}
