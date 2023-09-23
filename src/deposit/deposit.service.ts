// deposit.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@transactions/enum/transaction-type.enum';
import { TransactionsService } from '@transactions/transactions.service';
import { User } from '@users/entities/user.entity';

@Injectable()
export class DepositService {
  constructor(
    private readonly transactionsService: TransactionsService
  ) {}

  async depositFunds(user: User, amount: number): Promise<User> {
    console.log(amount);
    return this.transactionsService.processTransaction(user, amount, TransactionType.DEPOSIT);
  }
}
