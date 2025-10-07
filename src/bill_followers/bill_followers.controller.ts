import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillFollowersService } from './bill_followers.service';
import { CreateBillFollowerDto } from './dto/create-bill_follower.dto';
import { UpdateBillFollowerDto } from './dto/update-bill_follower.dto';

@Controller('bill-followers')
export class BillFollowersController {
  constructor(private readonly billFollowersService: BillFollowersService) {}

  @Post()
  create(@Body() createBillFollowerDto: CreateBillFollowerDto) {
    return this.billFollowersService.create(createBillFollowerDto);
  }

  @Get()
  findAll() {
    return this.billFollowersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billFollowersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillFollowerDto: UpdateBillFollowerDto) {
    return this.billFollowersService.update(+id, updateBillFollowerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billFollowersService.remove(+id);
  }
}
