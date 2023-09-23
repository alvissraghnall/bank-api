import { InputType, Int, Field } from '@nestjs/graphql';
import { Match } from '@auth/validator/match.validator';
import { IsNumberString, IsAscii, IsEmail, IsNumber, MinLength, Length,  } from "class-validator";
import { IsUnique } from '@common/is-unique';

@InputType()
export class CreateUserInput {

  @Field(() => String, { description: "Username" })
  @MinLength(3)
  @IsAscii()
  @IsUnique("user", "username", { always: true, message: 'username already exists' })
  username: string;

  @Field(() => String, { description: "User email address" })
  @IsEmail()
  @IsUnique("user", "email", { always: true, message: 'email already exists' })
  email: string;

  @Field(() => String, { description: "User password" })
  @IsAscii()
  @MinLength(8)
  password: string;

  @Field(() => String, { description: "User Account Number" })
  @IsNumberString()
  @Length(10, 10)
  @IsUnique("user", "phoneNumber", { always: true, message: 'account number already exists' })
  phoneNumber: string;

  @Field(() => String, { description: "User confirm password" })
  @IsAscii()
  @MinLength(8)
  @Match<CreateUserInput>("password")
  confirmPassword: string;

  @Field(() => String, { 
    description: "User display photo (avatar)",
    nullable: true
  })
  avatar?: string;
}
