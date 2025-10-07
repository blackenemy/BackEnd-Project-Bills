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
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { User } from 'src/common/decorators/user.decorator';
import { getBillDto } from './dto/get-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('create')
  public async create(@Body() body: CreateBillDto, @User('userId') userId: string) {
    return this.billsService.create(body, userId);
  }

  @Get('findAll')
  public async findAll(@Query() query: getBillDto) {
    return this.billsService.findAll(query);
  }

  @Get('findOne/:id')
  public async findOne(@Param('id') id: number) {
    return this.billsService.findOne(id);
  }

  @Patch('update/:id')
  public async update(@Param('id') id: number, @Body() updateBillDto: UpdateBillDto) {
    return this.billsService.update(+id, updateBillDto);
  }

  @Delete('delete/:id')
  public async remove(@Param('id') id: number) {
    return this.billsService.remove(id);
  }
}
