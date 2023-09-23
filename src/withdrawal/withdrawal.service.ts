import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionType } from '@transactions/enum/transaction-type.enum';
import { TransactionsService } from '@transactions/transactions.service';
import { User } from '@users/entities/user.entity';

@Injectable()
export class WithdrawalService {
  constructor(
    private readonly transactionsService: TransactionsService
  ) {}

  async withdrawFunds(user: User, amount: number): Promise<User> {
    
    return this.transactionsService.processTransaction(user, amount, TransactionType.WITHDRAWAL);
   
  }
}
