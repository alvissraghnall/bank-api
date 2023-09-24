import { Test, TestingModule } from '@nestjs/testing';
import { DepositService } from './deposit.service';
import { TransactionsService } from '@transactions/transactions.service';
import { TransactionType } from '@transactions/enum/transaction-type.enum';
import { User } from '@users/entities/user.entity';
import { TransactionsModule } from '@transactions/transactions.module';
import { UsersModule } from '@users/users.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '@transactions/entities/transaction.entity';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('depositService', () => {
  let depositService: DepositService;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositService, TransactionsService, {
        provide: getRepositoryToken(User),
        useValue: {
          create: jest.fn(),
          save: jest.fn(),
          find: jest.fn(),
          findOne: jest.fn(),
        },
      }, {
        provide: getRepositoryToken(Transaction),
        useValue: {
          create: jest.fn(),
          save: jest.fn(),
          find: jest.fn(),
          findOne: jest.fn(),
        },
      },],
      // imports: [TransactionsModule]
    }).compile();

    depositService = module.get<DepositService>(DepositService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(DepositService).toBeDefined();
  });

  describe('depositFunds', () => {
    it('should call transactionsService.processTransaction with the correct arguments', async () => {
      const mockUser = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );
      const amount = 100;
    
      // Mock the behavior of processTransaction to throw a different exception
      const processTransactionSpy = jest.spyOn(transactionsService, 'processTransaction');
      processTransactionSpy.mockImplementation(() => {
        throw new BadRequestException('Insufficient balance'); // Adjust the exception type as needed
      });
    
      try {
        await depositService.depositFunds(mockUser, amount);
      } catch (error) {
        // Handle the expected exception
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Insufficient balance');
      }
    
      expect(processTransactionSpy).toHaveBeenCalledWith(mockUser, amount, TransactionType.DEPOSIT);
    });
    

    it('should return the result from transactionsService.processTransaction', async () => {
      const mockUser = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );
      const amount = 100;

      const expectedResult = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      ); // Mock the expected result
      jest.spyOn(transactionsService, 'processTransaction').mockResolvedValue(expectedResult);

      const result = await depositService.depositFunds(mockUser, amount);

      expect(result).toBe(expectedResult);
    });

  });
});
