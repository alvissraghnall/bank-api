import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { WithdrawalService } from './withdrawal.service';
import { CurrentUser } from '@common/current-user.decorator';
import { User } from '@users/entities/user.entity';
import { CreateWithdrawalInput } from './dto/create-withdrawal.input';

@Resolver('User')
export class WithdrawalResolver {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Mutation(() => User)
  async withdrawFunds(
    @Args('createWithdrawalInput') createWithdrawalInput: CreateWithdrawalInput,
    @CurrentUser() user: User,
  ) {
    return this.withdrawalService.withdrawFunds(user, createWithdrawalInput.amount);
  }
}
