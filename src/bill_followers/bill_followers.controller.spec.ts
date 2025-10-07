import { Test, TestingModule } from '@nestjs/testing';
import { BillFollowersController } from './bill_followers.controller';
import { BillFollowersService } from './bill_followers.service';

describe('BillFollowersController', () => {
  let controller: BillFollowersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillFollowersController],
      providers: [BillFollowersService],
    }).compile();

    controller = module.get<BillFollowersController>(BillFollowersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
