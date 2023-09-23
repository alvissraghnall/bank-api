import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IsUniqueConstraint } from '@common/is-unique';
import { MoneyTransferModule } from './money-transfer/money-transfer.module';
import { AppController } from './app.controller';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      // dropSchema: true,
      autoLoadEntities: true,
      // schema: "all"

    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: {
        origin: '*',
        credentials: true
      },
      playground: true,
      debug: true
    }),
    UsersModule,
    AuthModule,
    MoneyTransferModule,
    DepositModule,
    WithdrawalModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
  exports: [TypeOrmModule]
})
export class AppModule {}
