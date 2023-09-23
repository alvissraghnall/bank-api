import { CreateDepositInput } from './create-deposit.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDepositInput extends PartialType(CreateDepositInput) {
  @Field(() => Int)
  id: number;
}
