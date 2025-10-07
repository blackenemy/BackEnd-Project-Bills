import { PartialType } from '@nestjs/swagger';
import { CreateBillLogDto } from './create-bill_log.dto';

export class UpdateBillLogDto extends PartialType(CreateBillLogDto) {}
