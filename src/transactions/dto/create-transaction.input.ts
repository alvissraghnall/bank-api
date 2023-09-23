import { TransactionType } from '../enum/transaction-type.enum';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {

  @Field(() => Float)
  amount: number;

  @Field(() => TransactionType, { nullable: true })
  type: TransactionType;

}


