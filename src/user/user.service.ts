import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
          { firstName: body.firstName, lastName: body.lastName },
        ],
      });

      if (checkUser) {
        throw new BadRequestException('มีข้อมูลนี้ในระบบแล้ว');
      }

      const result = this.userRepository.create(body);
      return this.userRepository.save(result);
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
          '(user.username ILIKE :search OR user.fname ILIKE :search OR user.lname ILIKE :search)',
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

  public async findOne(id: string): Promise<User | null> {
    try{
      const result = this.userRepository.findOne({where: {id} });
      return result;
    } catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  public async update(id: string, body: UpdateUserDto) {
    try{
      const user = await this.userRepository.findOne({where: {id} });
      if(!user){
        throw new BadRequestException('ไม่พบข้อมูลนี้ในระบบ');
      }
      const updatedUser = Object.assign(user, body);
      return this.userRepository.save(updatedUser);
    } catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  public async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({where: {id} });
    if(!user){
      throw new BadRequestException('ไม่พบข้อมูลนี้ในระบบ');
    }
    await this.userRepository.remove(user);
    return;
  }

  
}
