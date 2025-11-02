import { Test, TestingModule } from '@nestjs/testing';
import { BillsService } from './bills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BillLog } from '../bill_logs/entities/bill_log.entity';

describe('BillsService', () => {
  let service: BillsService;
  let billRepo: any;
  let billLogRepo: any;

  beforeEach(async () => {
    billRepo = { create: jest.fn(), save: jest.fn() };
    billLogRepo = { save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        { provide: getRepositoryToken(Bill), useValue: billRepo },
        { provide: getRepositoryToken(BillLog), useValue: billLogRepo },
      ],
    }).compile();
    service = module.get<BillsService>(BillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a bill and log', async () => {
    const billData = { title: 'test', amount: '100', status: 'pending' };
    const userId = 1;
    const billEntity = { ...billData, id: 1, create_by: userId, status: 'pending' };
    billRepo.create.mockReturnValue(billEntity);
    billRepo.save.mockResolvedValue(billEntity);
    billLogRepo.save.mockResolvedValue({});
    const result = await service.create(billData as any, userId);
    expect(billRepo.create).toHaveBeenCalledWith({ ...billData, create_by: userId });
    expect(billRepo.save).toHaveBeenCalledWith(billEntity);
    expect(result).toEqual(billEntity);
  });

  it('should create a bill and log (realistic)', async () => {
    const billData = { title: 'test', amount: '100', status: 'pending' };
    const userId = 1;
    const billEntity = { ...billData, id: 1, create_by: userId, status: 'pending' };
    billRepo.create.mockReturnValue(billEntity);
    billRepo.save.mockResolvedValue(billEntity);
    billLogRepo.save.mockResolvedValue({});
    const result = await service.create(billData as any, userId);
    expect(billRepo.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'test', create_by: userId }));
    expect(billRepo.save).toHaveBeenCalledWith(billEntity);
    expect(result).toEqual(expect.objectContaining({ title: 'test', id: 1 }));
  });
});
