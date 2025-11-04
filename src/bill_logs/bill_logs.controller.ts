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
import { BillLogsService } from './bill_logs.service';
import { CreateBillLogDto } from './dto/create-bill_log.dto';
import { UpdateBillLogDto } from './dto/update-bill_log.dto';
import { getBillLogDto } from './dto/get-bill_log.dto';
import { BillLog } from './entities/bill_log.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';

@ApiTags('Bill-Logs')
@Controller('bill-logs')
export class BillLogsController {
  constructor(private readonly billLogsService: BillLogsService) {}

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'สร้างแถว log ใหม่' })
  @ApiCreatedResponse({ description: 'สร้างสำเร็จ' })
  @ApiBadRequestResponse({ description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Post('create')
  public async create(
    @Body() body: CreateBillLogDto,
    @Request() req,
  ): Promise<BillLog> {
    return await this.billLogsService.create(body, req);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'ดึง log ตามตัวกรอง' })
  @ApiOkResponse({ description: 'รายการ log ตามเงื่อนไข' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Get('findAll')
  public async findAll(@Query() query: getBillLogDto) {
    return await this.billLogsService.findAll(query);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'ดูรายละเอียด log ตาม id' })
  @ApiNotFoundResponse({ description: 'ไม่พบ log ตาม id ที่ให้มา' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Get('findOne/:id')
  public async findOne(@Param('id') id: string) {
    return await this.billLogsService.findOne(+id);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'แก้ไข log (ถ้าจำเป็น)' })
  @ApiOkResponse({ description: 'อัพเดต log สำเร็จ' })
  @ApiBadRequestResponse({ description: 'ข้อมูลไม่ถูกต้อง' })
  @ApiNotFoundResponse({ description: 'ไม่พบ log ตาม id ที่ให้มา' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Patch('update/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateBillLogDto: UpdateBillLogDto,
  ): Promise<BillLog> {
    return await this.billLogsService.update(+id, updateBillLogDto);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'ลบ log (ถ้าจำเป็น)' })
  @ApiOkResponse({ description: 'ลบ log สำเร็จ' })
  @ApiNotFoundResponse({ description: 'ไม่พบ log ตาม id ที่ให้มา' })
  @ApiUnauthorizedResponse({ description: 'ต้องระบุ token (JWT)' })
  @ApiForbiddenResponse({ description: 'ไม่มีสิทธิ์เข้าถึง' })
  @Delete('delete/:id')
  public async remove(@Param('id') id: string) {
    return await this.billLogsService.remove(+id);
  }
}
