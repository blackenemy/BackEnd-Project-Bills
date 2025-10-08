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
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { User } from 'src/common/decorators/user.decorator';
import { getBillDto } from './dto/get-bill.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Bill } from './entities/bill.entity';

@ApiTags('Bill')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

   @ApiOperation({ summary: 'สร้างบิล' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async create(@Body() body: CreateBillDto, @Request() req) {
    console.log('🔥 req.user:', req.user.id);
    const userId = req.user?.id;
    return this.billsService.create(body, userId);
  }

   @ApiOperation({ summary: 'ค้นหาบิลทั้งหมด' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findAll')
  public async findAll(@Query() query: getBillDto) {
    return this.billsService.findAll(query);
  }

   @ApiOperation({ summary: 'ติดตามบิลตามเลขไอดี' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findOne/:id')
  public async findOne(@Param('id') id: number): Promise<Bill | null>{
    return this.billsService.findOne(id);
  }

   @ApiOperation({ summary: 'แก้ไขบิล' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  public async update(
    @Param('id') id: number,
    @Body() body: UpdateBillDto,
    @Request() req,
  ) {
    const userId = req.user?.id
    return this.billsService.update(id, body, userId);
  }

   @ApiOperation({ summary: 'ลบบิล' })
  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete/:id')
  public async remove(@Param('id') id: number, @Request() req) {
    const userId = req.user?.id
    return this.billsService.remove(id, userId);
  }
}
