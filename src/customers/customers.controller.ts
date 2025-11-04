import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { GetCustomerDto } from './dto/get-customer.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'สร้างลูกค้าใหม่' })
  @ApiResponse({ status: 201, description: 'สร้างลูกค้าสำเร็จ' })
  @ApiResponse({ status: 409, description: 'อีเมลซ้ำ' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @GetUser('id') userId: number) {
    return this.customersService.create(createCustomerDto, userId);
  }

  @ApiOperation({ summary: 'ดึงรายการลูกค้าทั้งหมด' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  @Get()
  findAll(@Query() query: GetCustomerDto) {
    return this.customersService.findAll(query);
  }

  @ApiOperation({ summary: 'ดึงข้อมูลลูกค้าตาม ID' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลลูกค้า' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'แก้ไขข้อมูลลูกค้า' })
  @ApiResponse({ status: 200, description: 'แก้ไขข้อมูลสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลลูกค้า' })
  @ApiResponse({ status: 409, description: 'อีเมลซ้ำ' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'ลบลูกค้า (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'ลบข้อมูลสำเร็จ' })
  @ApiResponse({ status: 404, description: 'ไม่พบข้อมูลลูกค้า' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
