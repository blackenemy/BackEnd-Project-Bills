import { PartialType } from '@nestjs/swagger';
import { CreateBillFollowerDto } from './create-bill_follower.dto';

export class UpdateBillFollowerDto extends PartialType(CreateBillFollowerDto) {}
