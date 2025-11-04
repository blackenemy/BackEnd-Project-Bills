import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { DeepPartial, Repository } from 'typeorm';
import { LessThan } from 'typeorm';
import { getBillDto } from './dto/get-bill.dto';
import { PaginatedBill } from 'src/common/interface/paginate.interface';
import { NotFoundError } from 'rxjs';
import { BillLog } from '../bill_logs/entities/bill_log.entity';
import { BillLogAction } from '../common/enum/bill-enum';
import { statusEnum } from 'src/common/enum/status-enum';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepo: Repository<Bill>,
    @InjectRepository(BillLog)
    private readonly billLogRepo: Repository<BillLog>,
  ) {}

  public async create(body: CreateBillDto, userId: number) {
    try {
      console.log('🚀 ~ BillsService ~ create ~ req:', userId);
      // only allow initial statuses of DRAFT or PENDING
      const allowedInitial = [statusEnum.DRAFT, statusEnum.PENDING];
      if (body.status && !allowedInitial.includes(body.status)) {
        throw new BadRequestException(
          `Initial status must be one of: ${allowedInitial.join(', ')}`,
        );
      }

      const initialStatus = body.status ?? statusEnum.PENDING;
      const bill = this.billRepo.create({
        ...body,
        create_by: userId,
        status: initialStatus,
      });
      const saved = await this.billRepo.save(bill);

      const billLog: DeepPartial<BillLog> = {
        bill_id: saved.id,
        user_id: userId,
        action: BillLogAction.CREATED,
        new_status: saved.status,
        note: 'bill created',
      };

      const billLogSave = await this.billLogRepo.save(billLog);
      if (!billLogSave) {
        throw new NotFoundException('Bill Log not create');
      }

      return saved;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(params: getBillDto): Promise<PaginatedBill | Bill[]> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy,
        orderBy,
        findAll,
      } = params;

      const query = this.billRepo.createQueryBuilder('bill');

      if (search) {
        query.andWhere(
          '(bill.title  ILIKE :search OR bill.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (status) {
        query.andWhere('bill.status = :status', { status });
      }

      if (sortBy) {
        const order: 'ASC' | 'DESC' =
          orderBy?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query.orderBy(`bill.${sortBy}`, order);
      } else {
        query.orderBy('bill.created_at', 'DESC');
      }

      if (findAll) {
        return query.getMany();
      }

      const [bill, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        bill,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOne(id: number): Promise<Bill | null> {
    const result = await this.billRepo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`Bill ID ${id} not found`);
    }
    return result;
  }

  public async update(id: number, body: UpdateBillDto, userId: number) {
    const bill = await this.billRepo.findOne({ where: { id } });
    if (!bill) {
      throw new NotFoundException(`Bill ID ${id} not found`);
    }

    const oldStatus = bill.status ?? null;
    const nextStatus = body.status ?? oldStatus;
    const isChangeStatus = oldStatus != nextStatus;

    const updated = this.billRepo.merge(bill, body);
    const saved = await this.billRepo.save(bill);

    const billLog: DeepPartial<BillLog> = {
      bill_id: { id: saved.id } as any,
      user_id: { id: userId } as any,
      action: isChangeStatus
        ? BillLogAction.STATUS_CHANGED
        : BillLogAction.UPDATED,
      old_status: oldStatus,
      new_status: nextStatus,
      note: 'bill update',
    };

    const billLogSave = await this.billLogRepo.save(billLog);
    if (!billLogSave) {
      throw new NotFoundException('Bill Log not create');
    }
    return await this.billRepo.save(updated);
  }

  public async remove(id: number, userId: number) {
    const bill = await this.billRepo.findOne({ where: { id } });
    if (!bill) {
      throw new NotFoundException(`Bill ID ${id} not found`);
    }

    const billLog: DeepPartial<BillLog> = {
      bill_id: { id } as any,
      user_id: { id: userId } as any,
      action: BillLogAction.DELETED,
      note: 'bill delete',
    };

    const billLogSave = await this.billLogRepo.save(billLog);
    if (!billLogSave) {
      throw new NotFoundException('Bill Log not create');
    }
    const remove = this.billRepo.softRemove(bill);
    return remove;
  }

  public async markPendingBillsAsLate() {
    const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
    const pendingBills = await this.billRepo.find({
      where: {
        status: statusEnum.PENDING,
        created_at: LessThan(cutoff),
      },
    });

    for (const b of pendingBills) {
      const old = b.status;
      b.status = statusEnum.LATE;
      const saved = await this.billRepo.save(b);

      const billLog = {
        bill_id: saved.id,
        user_id: null,
        action: BillLogAction.STATUS_CHANGED,
        old_status: old,
        new_status: saved.status,
        note: 'auto marked late after 15 minutes',
      } as DeepPartial<BillLog>;
      await this.billLogRepo.save(billLog as any);
      console.log(`Bill ${b.id} marked as LATE`);
    }
  }
}
