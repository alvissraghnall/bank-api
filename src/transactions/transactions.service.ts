// transaction.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './enum/transaction-type.enum';
import { User } from '@users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';

@Injectable()
export class TransactionsService {
  create(createTransactionInput: CreateTransactionInput) {
    return createTransactionInput;
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  findOne(id: number) {
    throw new Error('Method not implemented.');
  }
  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    throw new Error('Method not implemented.');
  }
  remove(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async processTransaction(user: User, amount: number, type: TransactionType): Promise<User> {
    // const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (amount <= 0) {
      throw new BadRequestException('Invalid transaction amount');
    }

    if (type === TransactionType.WITHDRAWAL && user.balance < amount) {
      throw new ForbiddenException('Insufficient balance');
    }

    // Update the user's balance based on the transaction type
    user.balance += type === TransactionType.DEPOSIT ? amount : -amount;

    // Create a transaction record
    const transaction = this.transactionRepository.create({
      amount,
      type,
    });

    user.transactions = [ ...(user.transactions || []), transaction];

    // No need to save transaction explicitly; it will be done automatically due to cascading
    await this.userRepository.save(user);

    return user;
  }
}
