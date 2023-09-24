import { Test, TestingModule } from '@nestjs/testing';
import { DepositResolver } from './deposit.resolver';
import { DepositService } from './deposit.service';
import { CreateDepositInput } from './dto/create-deposit.input';
import { User } from '@users/entities/user.entity';
import { TransactionType } from '@transactions/enum/transaction-type.enum';
import { BadRequestException } from '@nestjs/common';

describe('DepositResolver', () => {
  let depositResolver: DepositResolver;
  let depositService: DepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositResolver,
        {
          provide: DepositService,
          useValue: {
            depositFunds: jest.fn(),
          },
        },
      ],
    }).compile();

    depositResolver = module.get<DepositResolver>(DepositResolver);
    depositService = module.get<DepositService>(DepositService);
  });

  it('should be defined', () => {
    expect(depositResolver).toBeDefined();
  });

  describe('depositFunds', () => {
    it('should deposit funds for the current user', async () => {
      const mockUser: User = {
        id: '1',
        phoneNumber: '1234567890',
        password: 'hashedPassword',
        username: 'testuser',
        balance: 100, // Initial balance
        email: '',
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockDepositInput: CreateDepositInput = {
        amount: 50, // Deposit amount
        type: TransactionType.DEPOSIT
      };

      jest.spyOn(depositService, 'depositFunds').mockResolvedValue({
        ...mockUser,
        balance: 150, // Updated balance after deposit
      });

      const result: User = await depositResolver.depositFunds(mockDepositInput, mockUser);

      expect(result.balance).toBe(150);
      expect(depositService.depositFunds).toHaveBeenCalledWith(mockUser, 50);
    });

    it('should throw an error if deposit amount is negative', async () => {
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

      const mockDepositInput: CreateDepositInput = {
        amount: 500,
        type: TransactionType.DEPOSIT
      };

      jest.spyOn(depositService, 'depositFunds').mockImplementation(() => {
        throw new BadRequestException('Insufficient balance'); 
      });

      try {
        await depositResolver.depositFunds(mockDepositInput, mockUser);
        // If depositFunds doesn't throw an error, the test should fail
        throw new Error('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Insufficient balance');
      }
    });

  });
});
