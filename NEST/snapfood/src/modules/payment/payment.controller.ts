import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentDto } from "./dto/payment.dto";
import { UserAuthGaurd } from "src/common/decorators/auth.decorator";
import type { Response } from "express";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("/")
  @UserAuthGaurd()
  gatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }

  @Get("/verify")
  async verify(@Query("Authority") authority: string, @Query("Status") status: string, @Res() res: Response) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url);
  }
}
