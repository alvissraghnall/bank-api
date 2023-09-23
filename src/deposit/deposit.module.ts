import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositResolver } from './deposit.resolver';
import { JwtKeyModule } from '@auth/jwt/jwt-key.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TransactionsModule } from '@transactions/transactions.module';

@Module({
  providers: [DepositResolver, DepositService, JwtService],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtKeyModule,
    TransactionsModule
  ],
})
export class DepositModule {}
