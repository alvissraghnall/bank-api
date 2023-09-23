// money-transfer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class MoneyTransfer {

  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  amount: number;

  @ManyToOne(() => User, {})
  @JoinColumn({ name: 'senderId' })  
  @Field(() => User)
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipientId' })
  @Field(() => User)
  recipient: User;
}
