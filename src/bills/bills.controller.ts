import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { User } from 'src/common/decorators/user.decorator';
import { getBillDto } from './dto/get-bill.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Bill } from './entities/bill.entity';

@ApiTags('Bill')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @ApiOperation({ summary: 'สร้างบิล' })
  @ApiCreatedResponse({ description: 'บิลถูกสร้างเรียบร้อย และบันทึก log การสร้าง' })
  @ApiBadRequestResponse({ description: 'ข้อมูลไม่ถูกต้อง (เช่น สถานะเริ่มต้นไม่อนุญาต)' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async create(@Body() body: CreateBillDto, @Request() req) {
    console.log('🔥 req.user:', req.user.id);
    const userId = req.user?.id;
    return this.billsService.create(body, userId);
  }

  @ApiOperation({ summary: 'ค้นหาบิลทั้งหมด' })
  @ApiOkResponse({ description: 'คืนรายการบิล (มี pagination เมื่อไม่ระบุ findAll)' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findAll')
  public async findAll(@Query() query: getBillDto) {
    return this.billsService.findAll(query);
  }

  @ApiOperation({ summary: 'ค้นหาบิลของผู้ใช้ตาม userId' })
  @ApiOkResponse({ description: 'คืนรายการบิลที่สร้างโดย userId' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @Get('findOne/userId/:userId')
  public async findByUser(@Param('userId') userId: number): Promise<Bill[]> {
    return this.billsService.findByUser(Number(userId));
  }

  @ApiOperation({ summary: 'ติดตามบิลตามเลขไอดี' })
  @ApiOkResponse({ description: 'คืนรายละเอียดของบิลที่ระบุ' })
  @ApiNotFoundResponse({ description: 'ไม่พบบิลตาม id ที่ให้มา' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findOne/:id')
  public async findOne(@Param('id') id: number): Promise<Bill | null> {
    return this.billsService.findOne(id);
  }

  @ApiOperation({ summary: 'แก้ไขบิล' })
  @ApiOkResponse({ description: 'อัพเดตบิลสำเร็จ และบันทึก log การแก้ไข/เปลี่ยนสถานะ' })
  @ApiBadRequestResponse({ description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiNotFoundResponse({ description: 'ไม่พบบิลตาม id ที่ให้มา' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  public async update(
    @Param('id') id: number,
    @Body() body: UpdateBillDto,
    @Request() req,
  ) {
    const userId = req.user?.id;
    return this.billsService.update(id, body, userId);
  }

  @ApiOperation({ summary: 'ลบบิล' })
  @ApiOkResponse({ description: 'ลบ (soft-delete) บิลสำเร็จ และบันทึก log การลบ' })
  @ApiNotFoundResponse({ description: 'ไม่พบบิลตาม id ที่ให้มา' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete/:id')
  public async remove(@Param('id') id: number, @Request() req) {
    const userId = req.user?.id;
    return this.billsService.remove(id, userId);
  }
}
