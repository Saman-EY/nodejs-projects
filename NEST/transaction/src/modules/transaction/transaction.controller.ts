import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { DepositDto, WithdraDto } from "./dto/depositDto";

@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("/deposit")
  deposit(@Body() depositDto: DepositDto) {
    return this.transactionService.deposit(depositDto);
  }

  @Post("/payment")
  payment(@Body() withdrawDto: WithdraDto) {
    const { productId, userId } = withdrawDto;
    return this.transactionService.paymentByWallet(productId, userId);
  }
}
