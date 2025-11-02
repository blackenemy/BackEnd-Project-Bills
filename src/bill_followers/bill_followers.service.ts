import {
  ConflictException,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bill } from 'src/bills/entities/bill.entity';
import { BillFollower } from './entities/bill_follower.entity';
import { title } from 'process';

@Injectable()
export class BillFollowersService {
  constructor(
    @InjectRepository(BillFollower)
    private readonly repo: Repository<BillFollower>,
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
  ) {}

  // ติดตามบิล
  public async follow(billId: number, userId: number) {
    try {
      const bill = await this.billRepo.findOne({ where: { id: billId } });
      if (!bill) throw new NotFoundException('Bill not found');

      const exist = await this.repo.findOne({
        where: { bill: { id: billId }, user: { id: userId } },
      });
      if (exist) throw new ConflictException('Already following');

      const result = this.repo.create({
        bill: { id: billId } as any,
        user: { id: userId } as any,
      });
      return await this.repo.save(result);
    } catch (error) {
      throw error;
    }
  }

  // เลิกติดตาม
  public async unfollow(billId: number, userId: number) {
    const exist = await this.repo.findOne({
      where: { bill: { id: billId }, user: { id: userId } },
    });
    if (!exist) throw new NotFoundException('Not following');
    return await this.repo.remove(exist);
  }

  // กำลังติดตามอยู่ไหม
  public async isFollowing(billId: number, userId: number) {
    const exist = await this.repo.findOne({
      where: { bill: { id: billId }, user: { id: userId } },
    });
    return { isFollowing: !!exist };
  }

  // รายการบิลที่ฉันติดตาม
  public async listMyFollowing(userId: number) {
    const result = await this.repo.find({
      where: { user: { id: userId } },
      relations: ['bill'],
      order: { created_at: 'DESC' },
    });
    return result;
  }

  // รายชื่อผู้ติดตามของบิล
  public async listFollowersOfBill(billId: number) {
    const result = await this.repo.find({
      where: { bill: { id: billId } },
      relations: ['user', 'bill'],
      order: { created_at: 'DESC' },
    });
    return result;
  }
}
