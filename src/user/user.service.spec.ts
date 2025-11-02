import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepo: any;

  beforeEach(async () => {
    userRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userData = { username: 'test', password: 'pass' };
    userRepo.findOne.mockResolvedValue(undefined);
    userRepo.create.mockReturnValue(userData);
    userRepo.save.mockResolvedValue({ ...userData, id: 1 });
    const result = await service.create(userData as any);
    expect(userRepo.create).toHaveBeenCalledWith(userData);
    expect(userRepo.save).toHaveBeenCalledWith(userData);
    expect(result).toEqual({ ...userData, id: 1 });
  });

  it('should create a user (realistic)', async () => {
    const userData = { username: 'test', password: 'pass' };
    userRepo.findOne.mockResolvedValue(undefined);
    userRepo.create.mockImplementation((data) => ({ ...data }));
    userRepo.save.mockImplementation(async (data) => ({ ...data, id: 1 }));
    const result = await service.create(userData as any);
    expect(userRepo.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'test' }));
    expect(userRepo.save).toHaveBeenCalledWith(expect.objectContaining({ username: 'test' }));
    expect(result).toEqual(expect.objectContaining({ username: 'test', id: 1 }));
  });
});
