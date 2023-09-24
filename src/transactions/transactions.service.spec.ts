import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { User } from '@users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './enum/transaction-type.enum';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource, Repository, getConnection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let userRepository: Repository<User>;
  let transactionRepository: Repository<Transaction>;
  let dataSource: DataSource;

  // Create a test database connection before running the tests
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: "postgres",
          url: process.env.TEST_DB_URL,
          synchronize: true,
          // dropSchema: true,
          autoLoadEntities: true,
          // entities: [User, Transaction],
        }),
        TypeOrmModule.forFeature([User, Transaction]),
      ],
      providers: [TransactionsService],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  // Close the test database connection after running the tests
  afterAll(async () => {
    
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  describe('processTransaction', () => {
    it('should process a deposit transaction', async () => {
      // Create a user and save it to the test database
      const user = userRepository.create({
        username: 'user gold',
        phoneNumber: '90201960731',
        balance: 1500,
        email: 'test@gold.com',
        password: 'password',
        avatar: 'avatar-url',
        bio: 'Test bio',
      });
      await userRepository.save(user);

      const initialBalance = user.balance;
      const amount = 500;

      // Process a deposit transaction
      const updatedUser = await transactionsService.processTransaction(user, amount, TransactionType.DEPOSIT);

      // Check if the user's balance is updated
      expect(updatedUser.balance).toBe(initialBalance + amount);

      // Check if a transaction record is created
      const transactions = await transactionRepository.find({ where: { user: {
        phoneNumber: user.phoneNumber
      } } });
      // console.log(transactions);
      expect(transactions.length).toBe(1);
      expect(transactions[0].type).toBe(TransactionType.DEPOSIT);
      expect(transactions[0].amount).toBe(amount);
    });

  });
});
