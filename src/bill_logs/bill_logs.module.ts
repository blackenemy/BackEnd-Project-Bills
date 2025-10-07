import { Module } from '@nestjs/common';
import { BillLogsService } from './bill_logs.service';
import { BillLogsController } from './bill_logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillLog } from './entities/bill_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillLog])],
  controllers: [BillLogsController],
  providers: [BillLogsService],
  exports: [TypeOrmModule, BillLogsService],
})
export class BillLogsModule {}
