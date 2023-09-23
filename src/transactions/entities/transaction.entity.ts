import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from '../enum/transaction-type.enum';

@Entity()
@ObjectType()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    @Field()
    id: string;
  
    @Field()
    @Column()
    amount: number;
  
    @ManyToOne(() => User, (user) => user.transactions) 
    @Field(() => User)
    user: User;

    @Column({ type: 'enum', enum: TransactionType })
    @Field(() => TransactionType)
    type: TransactionType;

    constructor (
        amount: number,
        type: TransactionType,
        user: User
    ) {
        this.amount = amount;
        this.type = type;
        this.user = user;
    }
    
}
