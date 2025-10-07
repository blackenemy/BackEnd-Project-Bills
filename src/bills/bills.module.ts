import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BillLog } from 'src/bill_logs/entities/bill_log.entity';
import { BillFollower } from 'src/bill_followers/entities/bill_follower.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Bill, BillLog, BillFollower])],
  controllers: [BillsController],
  providers: [BillsService],
  exports:[BillsService],
})
export class BillsModule {}
