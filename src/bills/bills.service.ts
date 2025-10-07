import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
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

  public async create(body: CreateBillDto, userId: string) {
    try {
      const bill = this.billRepo.create({
        ...body,
        create_by: userId ?? null,
      });
      const saved = await this.billRepo.save(bill);

      const billLog = this.billLogRepo.create({
        bill_Id: { id: saved.id } as any,
        user_Id: userId ?? null,
        action: BillLogAction.CREATED,
        new_status: saved.status,
        note: 'bill created',
      });

      await this.billLogRepo.save(billLog);
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
        query.orderBy('bill.createdAt', 'DESC');
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
      const bill = await this.billRepo.findOne({ where: { id } });
      return bill;
    } catch (error) {
      throw new error();
    }
  }

  public async update(id: number, body: UpdateBillDto) {
    try {
      const bill = await this.billRepo.findOne({ where: { id } });
      if (!bill) {
        throw new NotFoundException(`Bill ID ${id} not found`);
      }

      const updated = this.billRepo.merge(bill, body);
      return await this.billRepo.save(updated);
    } catch (error) {
      throw new error();
    }
  }

  public async remove(id: number) {
    try {
      const bill = await this.billRepo.findOne({ where: { id } });
      if (!bill) {
        throw new NotFoundException(`Bill ID ${id} not found`);
      }

      const remove = this.billRepo.remove(bill);
      return remove;
    } catch (error) {
      throw new error();
    }
  }
}
