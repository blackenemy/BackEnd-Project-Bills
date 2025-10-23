import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUserDto } from './dto/get-user.dto';
import { PaginatedUsers } from 'src/common/interface/paginate.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  public async create(body: CreateUserDto): Promise<User> {
    try {
      const checkUser = await this.userRepository.findOne({
        where: [
          { username: body.username },
          { firstname: body.firstname, lastname: body.lastname },
        ],
      });

      if (checkUser) {
        throw new BadRequestException('มีข้อมูลนี้ในระบบแล้ว');
      }

      const password = await User.hashPassword(body.password);
      const Newbody = this.userRepository.create({
        username: body.username,
        firstname: body.firstname,
        lastname: body.lastname,
        role: body.role,
        password,
      });
      const saveUser = await this.userRepository.save(Newbody);

      const { passwordHash: _omit, ...result } = saveUser as any;
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findAll(params: getUserDto): Promise<PaginatedUsers | User[]> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        sortBy,
        orderBy,
        findAll,
      } = params;

      const query = this.userRepository.createQueryBuilder('user');

      if (search) {
        query.andWhere(
          '(user.username ILIKE :search OR user.firstname ILIKE :search OR user.lastname ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (role) {
        query.andWhere('user.role = :role', { role });
      }

      if (sortBy) {
        const order: 'ASC' | 'DESC' =
          orderBy?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query.orderBy(`user.${sortBy}`, order);
      } else {
        query.orderBy('user.created_At', 'DESC');
      }

      if (findAll) {
        return query.getMany();
      }

      const [users, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        users,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOne(id: number): Promise<User | null> {
    try {
      const result = this.userRepository.findOne({ where: { id } });
      if(!result){
        throw new NotFoundException(`User ID ${id} not found`)
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async update(id: number, body: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('ไม่พบข้อมูลนี้ในระบบ');
      }
      const updatedUser = Object.assign(user, body);
      return this.userRepository.save(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('ไม่พบข้อมูลนี้ในระบบ');
    }
    await this.userRepository.remove(user);
    return;
  }

  public async findByUsername(username: string): Promise<User | null> {
    try {
      const result = this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.username = :username', { username })
        .getOne();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
