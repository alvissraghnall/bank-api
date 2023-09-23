
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateMoneyTransferInput {

    @Field()
    recipientId: string;

    @Field(() => Float)
    amount: number;
    
}
