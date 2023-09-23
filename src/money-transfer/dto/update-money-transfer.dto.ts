import { PartialType } from '@nestjs/swagger';
import { CreateMoneyTransferInput } from './create-money-transfer.dto';

export class UpdateMoneyTransferInput extends PartialType(CreateMoneyTransferInput) {}
