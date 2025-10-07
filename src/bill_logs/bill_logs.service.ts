import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { CreateBillLogDto } from './dto/create-bill_log.dto';
import { UpdateBillLogDto } from './dto/update-bill_log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BillLog } from './entities/bill_log.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { getBillLogDto } from './dto/get-bill_log.dto';
import { PaginatedBillLog } from 'src/common/interface/paginate.interface';
import dayjs from 'dayjs';
import { BillLogAction } from 'src/common/enum/bill-enum';

@Injectable()
export class BillLogsService {
  constructor(
    @InjectRepository(BillLog)
    private readonly billLogRepo: Repository<BillLog>,
  ) {}
  
  public async create(body: CreateBillLogDto, @Request() req) {
    try {
      const billLog = await this.billLogRepo.create({
        bill_Id: req.bill.id,
        user_Id: req.user.id,
        action: BillLogAction.CREATED,
        old_status: req.body ?? null,
        new_status: req.body,
        created_at: new Date(),
      });
      return this.billLogRepo.save(billLog);
    } catch (error) {
      throw new error();
    }
  }

  public async findAll(
    params: getBillLogDto,
  ): Promise<PaginatedBillLog | BillLog[]> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        billId,
        action,
        userId,
        sortBy,
        orderBy,
        findAll,
      } = params;

      const query = this.billLogRepo
        .createQueryBuilder('billLog')
        .leftJoinAndSelect('billLog.bill', 'bill')
        .leftJoinAndSelect('billlog.user', 'user');

      if (search) {
        query.andWhere(
          '(user.firtname ILIKE :search OR user.lastname ILIKE :search OR bill.status ILIKE :search OR bill.title ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (billId) {
        query.andWhere('billLog.bill_Id = :billId', { billId });
      }

      if (action) {
        query.andWhere('billLog.action = :action', { action });
      }
      if (userId) {
        query.andWhere('billLog.user_Id = :userId', { userId });
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

      const [billLog, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        billLog,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOne(id: number) {
    try {
      const billLog = await this.billLogRepo.findOne({
        where: { id },
        relations: ['bill', 'user'],
      });

      if (!billLog) {
        throw new NotFoundException(`Bill Log ${id} not found`);
      }
    } catch (error) {
      throw new error();
    }
  }

  public async update(id: number, dto: UpdateBillLogDto) {
    try {
      const billLog = await this.billLogRepo.findOne({ where: { id } });
      if (!billLog) {
        throw new NotFoundException(`This action updates a #${id} billLog`);
      }

      const update = this.billLogRepo.merge(billLog, dto);
      return await this.billLogRepo.save(update);
    } catch (error) {
      throw new error();
    }
  }

  public async remove(id: number) {
    try {
      const billLog = await this.billLogRepo.softDelete(id);
      if (billLog.affected === 0){
        throw new NotFoundException(`Bill Log ${id} not found`)
      }
    } catch (error) {}
  }
}
