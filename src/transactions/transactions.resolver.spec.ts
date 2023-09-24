import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionType } from './enum/transaction-type.enum';

describe('TransactionsResolver', () => {
  let transactionsResolver: TransactionsResolver;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsResolver, TransactionsService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          }
        }, {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          }
        }],
    }).compile();

    transactionsResolver = module.get<TransactionsResolver>(TransactionsResolver);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(transactionsResolver).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create and return a new transaction', async () => {
      const mockTransaction: Transaction = {
        id: '1',
        amount: 100,
        type: TransactionType.DEPOSIT,
        user: undefined
      };
      
      const mockCreateTransactionInput: CreateTransactionInput = {
        amount: 100,
        type: TransactionType.DEPOSIT,
        // Add other properties as needed
      };

      jest.spyOn(transactionsService, 'create').mockReturnValue(mockTransaction);

      const result = await transactionsResolver.createTransaction(mockCreateTransactionInput);

      expect(result).toEqual(mockTransaction);
      expect(transactionsService.create).toHaveBeenCalledWith(mockCreateTransactionInput);
    });
  });
});
