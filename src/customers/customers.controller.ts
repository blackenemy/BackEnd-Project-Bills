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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiConflictResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'สร้างลูกค้าใหม่' })
  @ApiCreatedResponse({ description: 'สร้างลูกค้าสำเร็จ' })
  @ApiConflictResponse({ description: 'อีเมลซ้ำ' })
  @ApiBadRequestResponse({ description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @GetUser('id') userId: number) {
    return this.customersService.create(createCustomerDto, userId);
  }

  @ApiOperation({ summary: 'ดึงรายการลูกค้าทั้งหมด' })
  @ApiOkResponse({ description: 'ดึงข้อมูลสำเร็จ' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Get()
  findAll(@Query() query: GetCustomerDto) {
    return this.customersService.findAll(query);
  }

  @ApiOperation({ summary: 'ดึงข้อมูลลูกค้าตาม ID' })
  @ApiOkResponse({ description: 'ดึงข้อมูลสำเร็จ' })
  @ApiNotFoundResponse({ description: 'ไม่พบข้อมูลลูกค้า' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'แก้ไขข้อมูลลูกค้า' })
  @ApiOkResponse({ description: 'แก้ไขข้อมูลสำเร็จ' })
  @ApiNotFoundResponse({ description: 'ไม่พบข้อมูลลูกค้า' })
  @ApiConflictResponse({ description: 'อีเมลซ้ำ' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'ลบลูกค้า (Soft Delete)' })
  @ApiOkResponse({ description: 'ลบข้อมูลสำเร็จ' })
  @ApiNotFoundResponse({ description: 'ไม่พบข้อมูลลูกค้า' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
