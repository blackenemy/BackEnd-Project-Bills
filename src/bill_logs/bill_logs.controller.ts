import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BillLogsService } from './bill_logs.service';
import { CreateBillLogDto } from './dto/create-bill_log.dto';
import { UpdateBillLogDto } from './dto/update-bill_log.dto';
import { getBillLogDto } from './dto/get-bill_log.dto';
import { BillLog } from './entities/bill_log.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('bill-logs')
export class BillLogsController {
  constructor(private readonly billLogsService: BillLogsService) {}

  @ApiOperation({ summary: 'สร้างแถว log ใหม่' })
  @ApiCreatedResponse({ description: 'สร้างสำเร็จ' })
  @Post('create')
  public async create(@Body() body: CreateBillLogDto): Promise<BillLog> {
    return await this.billLogsService.create(body);
  }

  @ApiOperation({ summary: 'ดึง log ตามตัวกรอง' })
  @ApiOkResponse({ description: 'รายการ log ตามเงื่อนไข' })
  @Get('findAll')
  public async findAll(@Query() query: getBillLogDto) {
    return await this.billLogsService.findAll(query);
  }

  @ApiOperation({ summary: 'ดูรายละเอียด log ตาม id' })
  @Get('findOne/:id')
  public async findOne(@Param('id') id: string) {
    return await this.billLogsService.findOne(+id);
  }

  @ApiOperation({ summary: 'แก้ไข log (ถ้าจำเป็น)' })
  @Patch('update/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateBillLogDto: UpdateBillLogDto,
  ): Promise<BillLog> {
    return await this.billLogsService.update(+id, updateBillLogDto);
  }

  @ApiOperation({ summary: 'ลบ log (ถ้าจำเป็น)' })
  @Delete('delete/:id')
  public async remove(@Param('id') id: string) {
    return await this.billLogsService.remove(+id);
  }
}
