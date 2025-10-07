import { Injectable } from '@nestjs/common';
import { CreateBillFollowerDto } from './dto/create-bill_follower.dto';
import { UpdateBillFollowerDto } from './dto/update-bill_follower.dto';

@Injectable()
export class BillFollowersService {
  create(createBillFollowerDto: CreateBillFollowerDto) {
    return 'This action adds a new billFollower';
  }

  findAll() {
    return `This action returns all billFollowers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} billFollower`;
  }

  update(id: number, updateBillFollowerDto: UpdateBillFollowerDto) {
    return `This action updates a #${id} billFollower`;
  }

  remove(id: number) {
    return `This action removes a #${id} billFollower`;
  }
}
