// money-transfer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyTransfer } from './entities/money-transfer.entity';
import { MoneyTransferService } from './money-transfer.service';
import { MoneyTransferResolver } from './money-transfer.resolver';
import { User } from '@users/entities/user.entity';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtKeyModule } from '@auth/jwt/jwt-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, MoneyTransfer]),
    JwtKeyModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    MoneyTransferService, 
    MoneyTransferResolver,
    JwtService
  ],
})
export class MoneyTransferModule {}
