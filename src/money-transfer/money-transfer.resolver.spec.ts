import { Test, TestingModule } from '@nestjs/testing';
import { MoneyTransferResolver } from './money-transfer.resolver';
import { MoneyTransferService } from './money-transfer.service';
import { User } from '@users/entities/user.entity';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CurrentUser } from '@common/current-user.decorator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoneyTransfer } from './entities/money-transfer.entity';


describe('MoneyTransferResolver', () => {
  let moneyTransferResolver: MoneyTransferResolver;
  let moneyTransferService: MoneyTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoneyTransferResolver,
        MoneyTransferService,
        {
          provide: JwtAuthGuard,
          useValue: {},
        },
        {
          provide: CurrentUser,
          useValue: (context: any) => context.req.user, // Mock the CurrentUser decorator
        }, 
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn()
          }
        }, 
        {
          provide: getRepositoryToken(MoneyTransfer),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn()
          }
        }
      ],
    }).compile();

    moneyTransferResolver = module.get<MoneyTransferResolver>(MoneyTransferResolver);
    moneyTransferService = module.get<MoneyTransferService>(MoneyTransferService);
  });

  it('should be defined', () => {
    expect(moneyTransferResolver).toBeDefined();
  });

  describe('transferMoney', () => {
    it('should transfer money and return the updated user', async () => {
      const mockUser: User = {
        id: '1',
        phoneNumber: '1234567890',
        password: 'hashedPassword',
        username: 'testuser',
        balance: 100,
        email: '',
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTransferDTO = {
        recipientId: '2',
        amount: 50,
      };

      const mockUpdatedUser: User = {
        ...mockUser,
        balance: 50, // Updated balance after the transfer
      };

      // Mock the moneyTransferService.transferMoney method
      jest.spyOn(moneyTransferService, 'transferMoney').mockResolvedValue(mockUpdatedUser);

      const result: User = await moneyTransferResolver.transferMoney(
        mockTransferDTO,
        mockUser
      );

      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
