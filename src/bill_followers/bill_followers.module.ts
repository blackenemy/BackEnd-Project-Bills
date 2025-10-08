import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bill } from 'src/bills/entities/bill.entity';
import { BillFollowersController } from './bill_followers.controller';
import { BillFollower } from './entities/bill_follower.entity';
import { BillFollowersService } from './bill_followers.service';


@Module({
  imports: [TypeOrmModule.forFeature([BillFollower, Bill])],
  controllers: [BillFollowersController],
  providers: [BillFollowersService],
  exports: [TypeOrmModule, BillFollowersService],
})
export class BillFollowersModule {}
