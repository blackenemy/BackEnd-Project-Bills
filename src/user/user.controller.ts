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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUserDto } from './dto/get-user.dto';
import { PaginatedUsers } from 'src/common/interface/paginate.interface';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get('findAll')
  async findAll(@Query() params: getUserDto): Promise<PaginatedUsers | User[]> {
    return this.userService.findAll(params);
  }

  @Get('findOne/:id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Patch('update/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
