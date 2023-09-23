import { Test, TestingModule } from '@nestjs/testing';
import { MoneyTransferService } from './money-transfer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoneyTransfer } from './entities/money-transfer.entity';
import { User } from '@users/entities/user.entity';

describe('MoneyTransferService', () => {
  let service: MoneyTransferService;

  const userRepositoryMock = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const moneyTransferRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoneyTransferService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: getRepositoryToken(MoneyTransfer),
          useValue: moneyTransferRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<MoneyTransferService>(MoneyTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more test cases for the service 
});
