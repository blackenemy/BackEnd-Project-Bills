import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { DeepPartial, Repository } from 'typeorm';
import { getBillDto } from './dto/get-bill.dto';
import { PaginatedBill } from 'src/common/interface/paginate.interface';
import { NotFoundError } from 'rxjs';
import { BillLog } from 'src/bill_logs/entities/bill_log.entity';
import { BillLogAction } from 'src/common/enum/bill-enum';

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
      const bill = this.billRepo.create({
        ...body,
        create_by: userId,
      });
      const saved = await this.billRepo.save(bill);

      const billLog: DeepPartial<BillLog> = {
        billId: { id: saved.id } as any,
        userId: { id: userId } as any,
        action: BillLogAction.CREATED,
        newStatus: saved.status,
        note: 'bill created',
      };

      const billLogSave = await this.billLogRepo.save(billLog);
      if (!billLogSave) {
        throw new NotFoundException('Bill Log not create');
      }

      return await this.billRepo.save(bill);
    } catch (error) {
      throw new error();
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
        query.orderBy('bill.created_At', 'DESC');
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
    try {
      const result = await this.billRepo.findOne({ where: { id } });
      if(!result){
        throw new NotFoundException(`Bill ID ${id} not found`)
      }
      return result;
    } catch (error) {
      throw new error();
    }
  }

  public async update(id: number, body: UpdateBillDto, userId: number) {
    try {
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
        billId: { id: saved.id } as any,
        userId: { id: userId } as any,
        action: isChangeStatus
          ? BillLogAction.STATUS_CHANGED
          : BillLogAction.UPDATED,
        oldStatus: oldStatus,
        newStatus: nextStatus,
        note: 'bill update',
      };

      const billLogSave = await this.billLogRepo.save(billLog);
      if (!billLogSave) {
        throw new NotFoundException('Bill Log not create');
      }
      return await this.billRepo.save(updated);
    } catch (error) {
      throw new error();
    }
  }

  public async remove(id: number, userId: number) {
    try {
      const bill = await this.billRepo.findOne({ where: { id } });
      if (!bill) {
        throw new NotFoundException(`Bill ID ${id} not found`);
      }

      const billLog: DeepPartial<BillLog> = {
        billId: { id } as any,
        userId: { id: userId } as any,
        action: BillLogAction.DELETED,
        note: 'bill delete',
      };

      const billLogSave = await this.billLogRepo.save(billLog);
      if (!billLogSave) {
        throw new NotFoundException('Bill Log not create');
      }
      const remove = this.billRepo.softRemove(bill);
      return remove;
    } catch (error) {
      throw new error();
    }
  }
}
