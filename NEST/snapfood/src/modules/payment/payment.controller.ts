import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { UserAuthGaurd } from 'src/common/decorators/auth.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("/")
  @UserAuthGaurd()
  gatewayUrl(){
    return this.paymentService.getGatewayUrl()
  }
}
