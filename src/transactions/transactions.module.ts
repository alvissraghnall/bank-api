import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';

@Module({
  providers: [TransactionsResolver, TransactionsService, JwtService],
  imports: [
    TypeOrmModule.forFeature([User, Transaction]),
  ],
  exports: [TransactionsService]
})
export class TransactionsModule {}
