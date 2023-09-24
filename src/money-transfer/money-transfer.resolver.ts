import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { MoneyTransferService } from './money-transfer.service';
import { User } from '@users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CreateMoneyTransferInput } from './dto/create-money-transfer.dto';
import { CurrentUser } from '@common/current-user.decorator';

@Resolver('MoneyTransfer')
export class MoneyTransferResolver {
  constructor(private readonly moneyTransferService: MoneyTransferService) {}

  @Mutation(() => User)
  async transferMoney(
    @Args('transferDTO') transferDTO: CreateMoneyTransferInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.moneyTransferService.transferMoney(user, transferDTO);
  }
}
