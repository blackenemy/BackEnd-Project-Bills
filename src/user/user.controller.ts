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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUserDto } from './dto/get-user.dto';
import { PaginatedUsers } from 'src/common/interface/paginate.interface';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @ApiOperation({
    summary: 'สร้างผู้ใช้ใหม่',
    description: 'เพิ่มข้อมูลผู้ใช้ใหม่เข้าสู่ระบบ',
  })
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findAll')
  @ApiOperation({
    summary: 'ดึงข้อมูลผู้ใช้ทั้งหมด',
    description: 'คืนค่ารายการผู้ใช้ทั้งหมด หรือแบ่งหน้าได้ตามพารามิเตอร์',
  })
  async findAll(@Query() params: getUserDto): Promise<PaginatedUsers | User[]> {
    return this.userService.findAll(params);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findOne/:id')
  @ApiOperation({
    summary: 'ค้นหาผู้ใช้ตาม ID',
    description: 'คืนค่าข้อมูลผู้ใช้ที่มี ID ตรงกับที่ระบุ',
  })
  async findOne(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  @ApiOperation({
    summary: 'อัปเดตข้อมูลผู้ใช้',
    description: 'อัปเดตข้อมูลผู้ใช้ที่ระบุด้วย ID',
  })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete/:id')
  @ApiOperation({
    summary: 'ลบผู้ใช้',
    description:
      'ลบข้อมูลผู้ใช้ตาม ID ที่ระบุ (soft delete หรือ hard delete ตามที่ระบบกำหนด)',
  })
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
