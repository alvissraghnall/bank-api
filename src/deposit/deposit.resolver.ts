// deposit.resolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { ClassSerializerInterceptor, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DepositService } from './deposit.service';
import { CreateDepositInput } from './dto/create-deposit.input';
import { User } from '@users/entities/user.entity';
import { CurrentUser } from '@common/current-user.decorator';
import { TransactionType } from '@transactions/enum/transaction-type.enum';

@Resolver(() => User)
export class DepositResolver {
  constructor(private readonly depositService: DepositService) {}

  @Mutation(() => User)
  @UseInterceptors(ClassSerializerInterceptor)
  async depositFunds(
    @Args('depositInput') depositInput: CreateDepositInput,
    @CurrentUser() user: User,
  ) {
    return await this.depositService.depositFunds(user, depositInput.amount);
  }
}
