import { ObjectType, Field, Int
 } from '@nestjs/graphql';
import { IsUnique } from '@common/is-unique';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Transaction } from '@transactions/entities/transaction.entity';

@ObjectType()
@Entity()
export class User {

  constructor(
    email: string,
    username: string,
    password: string,
    avatar: string,
    phoneNumber: string
  ) {
    this.avatar = avatar;
    this.password = password;
    this.email = email;
    this.username = username;
    this.phoneNumber = phoneNumber;
  }

  @Field(() => String, { description: "ID"})
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({
    unique: true,
    length: 255
  })
  username: string;

  @Field()
  @Column({ unique: true })
  phoneNumber: string;

  @Field()
  @Column({ default: 0 })
  balance: number = 0;

  @Field()
  @Column({
    unique: true,
    length: 255
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Field({
    nullable: true
  })
  @Column({
    nullable: true
  })
  avatar?: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true
  })
  bio?: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: true
  })
  @JoinColumn()
  transactions: Transaction[];

  @CreateDateColumn() 
  createdAt: Date;
  
  @UpdateDateColumn() 
  updatedAt: Date;
}
