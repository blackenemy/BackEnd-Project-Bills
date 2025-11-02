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
import { DeepPartial, Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { getBillLogDto } from './dto/get-bill_log.dto';
import { PaginatedBillLog } from 'src/common/interface/paginate.interface';
import dayjs from 'dayjs';
import { BillLogAction } from '../common/enum/bill-enum';

@Injectable()
export class BillLogsService {
  constructor(
    @InjectRepository(BillLog)
    private readonly billLogRepo: Repository<BillLog>,
  ) {}

  public async create(body: CreateBillLogDto, @Request() req) {
    try {
      // สร้าง payload เฉพาะ field ที่ตรงกับ entity เท่านั้น (ไม่ spread ...body)
      const payload: DeepPartial<BillLog> = {
        bill_id: body.billId,
        user_id: body.userId,
        action: body.action ?? BillLogAction.CREATED,
        old_status: body.oldStatus,
        new_status: body.newStatus,
        note: body.note,
      };
      // ลบ property ที่ไม่ตรงกับ entity ออกจาก body (ป้องกัน validation error)
      // ไม่ต้องส่ง ...body เข้าไปใน create()
      const billLog = this.billLogRepo.create(payload);
      return await this.billLogRepo.save(billLog);
    } catch (err) {
      throw new InternalServerErrorException(err.message ?? err);
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
        query.andWhere('billLog.user_id = :userId', { userId });
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
    const billLog = await this.billLogRepo.findOne({
      where: { id }
    });
    if (!billLog) {
      throw new NotFoundException(`Bill Log ${id} not found`);
    }
    return billLog;
  }

  public async update(id: number, dto: UpdateBillLogDto) {
    const billLog = await this.billLogRepo.findOne({ where: { id } });
    if (!billLog) {
      throw new NotFoundException(`This action updates a #${id} billLog`);
    }
    const update = this.billLogRepo.merge(billLog, dto);
    return await this.billLogRepo.save(update);
  }

  public async remove(id: number) {
    const billLog = await this.billLogRepo.softDelete(id);
    if (billLog.affected === 0) {
      throw new NotFoundException(`Bill Log ${id} not found`);
    }
  }
}
