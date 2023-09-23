import { InputType, Field, Float } from '@nestjs/graphql';
import { CreateTransactionInput } from '@transactions/dto/create-transaction.input';
import { TransactionType } from '@transactions/enum/transaction-type.enum';

@InputType()
export class CreateWithdrawalInput extends CreateTransactionInput {

}
