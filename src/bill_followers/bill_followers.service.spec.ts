import { Test, TestingModule } from '@nestjs/testing';
import { BillFollowersService } from './bill_followers.service';

describe('BillFollowersService', () => {
  let service: BillFollowersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillFollowersService],
    }).compile();

    service = module.get<BillFollowersService>(BillFollowersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
