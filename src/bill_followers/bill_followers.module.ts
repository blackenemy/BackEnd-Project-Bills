import { Module } from '@nestjs/common';
import { BillFollowersService } from './bill_followers.service';
import { BillFollowersController } from './bill_followers.controller';

@Module({
  controllers: [BillFollowersController],
  providers: [BillFollowersService],
})
export class BillFollowersModule {}
