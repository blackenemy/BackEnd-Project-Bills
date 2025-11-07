import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetCustomerDto } from './dto/get-customer.dto';
import { PaginationInterface } from '../common/interface/paginate.interface';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, userId: number): Promise<Customer> {
    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email, deleted_at: IsNull() },
    });

    if (existingCustomer) {
      throw new ConflictException('อีเมลนี้มีอยู่ในระบบแล้ว');
    }

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      create_by: userId,
    });

    return await this.customerRepository.save(customer);
  }

  async findAll(query: GetCustomerDto): Promise<PaginationInterface<Customer>> {
    const { page = 1, limit = 10, firstname, lastname, email, phone } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.created_by', 'user')
      .where('customer.deleted_at IS NULL');

    if (firstname) {
      queryBuilder.andWhere('customer.firstname LIKE :firstname', { firstname: `%${firstname}%` });
    }

    if (lastname) {
      queryBuilder.andWhere('customer.lastname LIKE :lastname', { lastname: `%${lastname}%` });
    }

    if (email) {
      queryBuilder.andWhere('customer.email LIKE :email', { email: `%${email}%` });
    }

    if (phone) {
      queryBuilder.andWhere('customer.phone LIKE :phone', { phone: `%${phone}%` });
    }

    const [customers, total] = await queryBuilder
      .orderBy('customer.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: number): Promise<Customer[]> {
    try {
      const customers = await this.customerRepository.find({
        where: { create_by: userId },
        relations: ['created_by'],
        order: { created_at: 'DESC' },
      });
      return customers;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['created_by'],
    });

    if (!customer) {
      throw new NotFoundException('ไม่พบข้อมูลลูกค้า');
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    // ตรวจสอบว่า email ซ้ำหรือไม่ (ถ้ามีการเปลี่ยน email)
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email, deleted_at: IsNull() },
      });

      if (existingCustomer) {
        throw new ConflictException('อีเมลนี้มีอยู่ในระบบแล้ว');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    customer.deleted_at = new Date();
    await this.customerRepository.save(customer);
  }
}
