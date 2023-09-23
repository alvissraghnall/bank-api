import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { MinLength, IsAscii, IsNumberString } from "class-validator";


@InputType()
export class LoginUserInput {

    @Field()
    @MinLength(10)
    @IsNumberString()
    phoneNumber: string;

    @Field()
    @MinLength(8)
    @IsAscii()
    password: String;
}