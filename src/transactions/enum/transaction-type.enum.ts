import { registerEnumType } from "@nestjs/graphql";

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL'
}

registerEnumType(TransactionType, {
    name: 'TransactionType'
});