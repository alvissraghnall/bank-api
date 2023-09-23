import { Module } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalResolver } from './withdrawal.resolver';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtKeyModule } from '@jwt/jwt-key.module';
import { TransactionsModule } from '@transactions/transactions.module';

@Module({
  providers: [WithdrawalResolver, WithdrawalService, JwtService],
  imports: [
    // TypeOrmModule.forFeature([Transaction]),
    JwtKeyModule,
    TransactionsModule
  ]
})
export class WithdrawalModule {}
