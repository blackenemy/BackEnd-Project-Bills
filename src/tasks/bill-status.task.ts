import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Bill } from '../bills/entities/bill.entity';
import { statusEnum } from 'src/common/enum/status-enum';

@Injectable()
export class BillStatusTask implements OnModuleInit {
  private readonly logger = new Logger(BillStatusTask.name);
  constructor(
    @InjectRepository(Bill)
    private readonly billRepo: Repository<Bill>,
  ) {}

  // run when module init - start interval
  async onModuleInit() {
    this.logger.log('Starting BillStatusTask interval');
    // run every minute to find bills older than 15 minutes and still pending
    setInterval(() => this.checkLateBills(), 60 * 1000);
  }

  private async checkLateBills() {
    try {
      const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
      const pendingBills = await this.billRepo.find({
        where: {
          status: statusEnum.PENDING,
          created_at: LessThan(cutoff),
        },
      });

      if (!pendingBills.length) return;

      for (const b of pendingBills) {
        b.status = statusEnum.LATE;
        await this.billRepo.save(b);
        this.logger.log(`Bill ${b.id} marked as LATE`);
      }
    } catch (err) {
      this.logger.error('Error checking late bills', err as any);
    }
  }
}
