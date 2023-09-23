import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { MoneyTransfer } from './entities/money-transfer.entity';
import { MoneyTransferDTO } from './dto/money-transfer.dto';
import { CreateMoneyTransferInput } from './dto/create-money-transfer.dto';

@Injectable()
export class MoneyTransferService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MoneyTransfer)
    private readonly moneyTransferRepository: Repository<MoneyTransfer>,
  ) {}

  async transferMoney(sender: User, transferDTO: CreateMoneyTransferInput): Promise<User> {
    // const sender = await this.userRepository.findOne(senderId);
    const recipient = await this.userRepository.findOneBy({id: transferDTO.recipientId});

    if (!sender || !recipient) {
      throw new NotFoundException('Sender or recipient not found');
    }

    if (sender.balance < transferDTO.amount || transferDTO.amount <= 0) {
      throw new BadRequestException('Invalid transfer amount');
    }

    sender.balance -= transferDTO.amount;
    recipient.balance += transferDTO.amount;

    await this.userRepository.save([sender, recipient]);

    const transferRecord = this.moneyTransferRepository.create({
      sender,
      recipient,
      amount: transferDTO.amount,
    });

    await this.moneyTransferRepository.save(transferRecord);

    return sender;
  }
}
