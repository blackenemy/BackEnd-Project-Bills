import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUserDto } from './dto/get-user.dto';
import { PaginatedUsers } from 'src/common/interface/paginate.interface';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findAll')
  async findAll(@Query() params: getUserDto): Promise<PaginatedUsers | User[]> {
    return this.userService.findAll(params);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('findOne/:id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth('bearer') // ให้ UI มี Authorize ปุ่ม
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
