import { Test, TestingModule } from '@nestjs/testing';
import { MoneyTransferService } from './money-transfer.service';
import { User } from '@users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMoneyTransferInput } from './dto/create-money-transfer.dto';
import { MoneyTransfer } from './entities/money-transfer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SaveRepository } from '@common/save.repository';

describe('MoneyTransferService', () => {
  let moneyTransferService: MoneyTransferService;
  let userRepository: Repository<User>;
  let moneyTransferRepository: Repository<MoneyTransfer>;

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoneyTransferService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MoneyTransfer),
          useClass: Repository,
        },
      ],
    }).compile();

    moneyTransferService = module.get<MoneyTransferService>(MoneyTransferService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    moneyTransferRepository = module.get<Repository<MoneyTransfer>>(getRepositoryToken(MoneyTransfer));
  });

  it('should be defined', () => {
    expect(moneyTransferService).toBeDefined();
  });

  describe('transferMoney', () => {
    it('should transfer money successfully', async () => {
      const sender = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );
      sender.balance = 1000;
      const recipient = new User(
        'jane@doe.com', 'jane dox', 'janedoe3009', '', '9033033033'
      );;
      const transferDTO: CreateMoneyTransferInput = {
        recipientId: recipient.id,
        amount: 500,
      };

      // Mock the repository methods
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(sender).mockResolvedValueOnce(recipient);
      
      const saveSenderSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(sender);
      const saveRecipientSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(recipient);

      const createSpy = jest.spyOn(moneyTransferRepository, 'create').mockReturnValue(new MoneyTransfer());
      const saveMoneyTransferSpy = jest.spyOn(moneyTransferRepository, 'save').mockResolvedValue(new MoneyTransfer());
      const findOneBySpy = jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(recipient);

      const result = await moneyTransferService.transferMoney(sender, transferDTO);

      // Assert that money was transferred successfully
      expect(result).toEqual(sender);
      expect(sender.balance).toBe(500);
      expect(recipient.balance).toBe(500);

      // Assert that repository methods were called with the correct arguments
      // expect(findOneSpy).toHaveBeenCalledWith(sender.id);
      expect(findOneBySpy).toHaveBeenCalledWith({id: transferDTO.recipientId});
      expect(saveSenderSpy).toHaveBeenCalledWith([sender, recipient]);
      // expect(saveRecipientSpy).toHaveBeenCalledWith([recipient]);
      expect(createSpy).toHaveBeenCalledWith({
        sender,
        recipient,
        amount: transferDTO.amount,
      });
      expect(saveMoneyTransferSpy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if sender or recipient is not found', async () => {
      const sender = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      const transferDTO: CreateMoneyTransferInput = {
        recipientId: 'nonexistent-id',
        amount: 500,
      };

      // Mock the repository methods to return null for sender or recipient
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      try {
        await moneyTransferService.transferMoney(sender, transferDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Sender or recipient not found');
      }
    });

    it('should throw BadRequestException for invalid transfer amount', async () => {
      const sender = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      const recipient = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      const transferDTO: CreateMoneyTransferInput = {
        recipientId: recipient.id,
        amount: 0, // Invalid amount
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(sender).mockResolvedValueOnce(recipient);

      try {
        await moneyTransferService.transferMoney(sender, transferDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid transfer amount');
      }
    });

    it('should throw BadRequestException if sender has insufficient balance', async () => {
      const sender = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      sender.balance = 100;
      const recipient = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      const transferDTO: CreateMoneyTransferInput = {
        recipientId: recipient.id,
        amount: 200, // Amount exceeds sender's balance
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(sender).mockResolvedValueOnce(recipient);

      try {
        await moneyTransferService.transferMoney(sender, transferDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid transfer amount');
      }
    });
  });
});
