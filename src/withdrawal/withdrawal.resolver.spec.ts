import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalResolver } from './withdrawal.resolver';
import { WithdrawalService } from './withdrawal.service';
import { User } from '@users/entities/user.entity';
import { CreateWithdrawalInput } from './dto/create-withdrawal.input';
import { TransactionType } from '@transactions/enum/transaction-type.enum';

describe('WithdrawalResolver', () => {
  let withdrawalResolver: WithdrawalResolver;
  let withdrawalService: WithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: WithdrawalService,
        useValue: {
          withdrawFunds: jest.fn()
        }
      }, WithdrawalResolver],
    }).compile();

    withdrawalResolver = module.get<WithdrawalResolver>(WithdrawalResolver);
    withdrawalService = module.get<WithdrawalService>(WithdrawalService);
  });

  it('should be defined', () => {
    expect(withdrawalResolver).toBeDefined();
  });

  describe('withdrawFunds', () => {
    it('should call withdrawalService.withdrawFunds with the correct arguments', async () => {
      const mockUser = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      const createWithdrawalInput: CreateWithdrawalInput = {
        amount: 100,
        type: TransactionType.DEPOSIT
      };

      const withdrawFundsSpy = jest.spyOn(withdrawalService, 'withdrawFunds');

      await withdrawalResolver.withdrawFunds(createWithdrawalInput, mockUser);

      expect(withdrawFundsSpy).toHaveBeenCalledWith(mockUser, createWithdrawalInput.amount);
    });

    it('should return the result from withdrawalService.withdrawFunds', async () => {
      const mockUser = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );;
      const createWithdrawalInput: CreateWithdrawalInput = {
        amount: 100, 
        type: TransactionType.DEPOSIT
      };

      const expectedResult = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      ); // Mock the expected result
      jest.spyOn(withdrawalService, 'withdrawFunds').mockResolvedValue(expectedResult);

      const result = await withdrawalResolver.withdrawFunds(createWithdrawalInput, mockUser);

      expect(result).toBe(expectedResult);
    });

  });
});
