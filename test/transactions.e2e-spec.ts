import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module'; // Import your AppModule or root module
import { TransactionsModule } from '../src/transactions/transactions.module'; // Import your TransactionsModule
import { User } from '../src/users/entities/user.entity'; // Import your User entity
import { ConfigModule } from '@nestjs/config';
import { Transaction } from '../src/transactions/entities/transaction.entity';

describe('TransactionsModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule, // The root module
        TransactionsModule, // The module being tested
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a transaction', async () => {
    // Perform a real HTTP request to your GraphQL endpoint
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            depositFunds(depositInput: { amount: 100 }) {
              id
              balance
            }
          }
        `,
      });

    // Assert the response status code (e.g., 200)
    expect(response.status).toBe(200);

    // Assert the response body contains the expected data
    expect(response.body.data).toBeDefined();
    expect(response.body.data.depositFunds).toBeDefined();
    expect(response.body.data.depositFunds.balance).toBe(100); // Adjust this based on your business logic
  });

  // Add more e2e test cases as needed

});
