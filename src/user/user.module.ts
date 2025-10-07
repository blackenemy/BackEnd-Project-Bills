import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Bill } from 'src/bills/entities/bill.entity';
import { BillLog } from 'src/bill_logs/entities/bill_log.entity';
import { BillFollower } from 'src/bill_followers/entities/bill_follower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bill, BillLog, BillFollower])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
