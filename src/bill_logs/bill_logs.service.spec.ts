import { Test, TestingModule } from '@nestjs/testing';
import { BillLogsService } from './bill_logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillLog } from './entities/bill_log.entity';
import { BillLogAction } from '../common/enum/bill-enum';

describe('BillLogsService', () => {
  let service: BillLogsService;
  let billLogRepo: any;

  beforeEach(async () => {
    billLogRepo = { create: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillLogsService,
        { provide: getRepositoryToken(BillLog), useValue: billLogRepo },
      ],
    }).compile();
    service = module.get<BillLogsService>(BillLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a bill log', async () => {
    const logData = { billId: 1, action: 'CREATED', userId: 1 };
    billLogRepo.create.mockReturnValue(logData);
    billLogRepo.save.mockResolvedValue({ ...logData, id: 1 });
    const result = await service.create(logData as any);
    expect(billLogRepo.create).toHaveBeenCalledWith(logData);
    expect(billLogRepo.save).toHaveBeenCalledWith(logData);
    expect(result).toEqual({ ...logData, id: 1 });
  });

  it('should create a bill log (realistic)', async () => {
    const logData = { billId: 1, action: 'created', userId: 1 };
    billLogRepo.create.mockReturnValue(logData);
    billLogRepo.save.mockResolvedValue({ ...logData, id: 1 });
    const result = await service.create(logData as any);
    expect(billLogRepo.create).toHaveBeenCalledWith(expect.objectContaining({ billId: 1, action: 'created', userId: 1 }));
    expect(billLogRepo.save).toHaveBeenCalledWith(expect.objectContaining({ billId: 1, action: 'created', userId: 1 }));
    expect(result).toEqual(expect.objectContaining({ billId: 1, action: 'created', userId: 1, id: 1 }));
  });
});
