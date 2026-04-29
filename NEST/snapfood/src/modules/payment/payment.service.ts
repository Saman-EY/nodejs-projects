import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { PaymentDataDto, PaymentDto } from "./dto/payment.dto";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { BasketService } from "../basket/basket.service";
import { ZarinpalService } from "../http/zarinpal.service";
import { OrderService } from "../order/order.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "src/common/enums";

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    @Inject(REQUEST) private req: Request,
    private basketService: BasketService,
    private zarinpalService: ZarinpalService,
    private orderService: OrderService,
  ) {}

  async getGatewayUrl(paymentDto: PaymentDto) {
    const { id: userId } = this.req.user;
    const basket = await this.basketService.getBasket();
    const order = await this.orderService.create(basket, paymentDto);
    const payment = await this.create({
      amount: basket.payment_amount,
      orderId: order.id,
      status: basket.payment_amount === 0,
      userId: userId as number,
      invoice_number: new Date().getTime().toString(),
    });

    if (payment.status) {
      const { authority, code, gatewayURL } = await this.zarinpalService.sendRequest({
        amount: basket.payment_amount,
        description: "PAYMENT ORDER",
        user: { email: "lorem@mail.com", mobile: "0999999999" },
      });
      payment.authority = authority;
      await this.paymentRepository.save(payment);
      return {
        gatewayURL,
        code,
      };
    }

    return {
      message: "payment successfuly",
    };
  }

  async create(paymentDto: PaymentDataDto) {
    const { amount, invoice_number, orderId, userId } = paymentDto;

    const payment = await this.paymentRepository.create({
      amount,
      invoice_number,
      orderId,
      status: false,
      userId,
    });

    return await this.paymentRepository.save(payment);
  }

  async verify(authority: string, status: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });

    if (!payment) throw new NotFoundException("payment not found");

    if (payment.status) throw new ConflictException("already verified");

    if (status === "OK") {
      const order = await this.orderService.findOne(payment.orderId)
      order.status = OrderStatus.Paid;
      await this.orderService.save(order)
      payment.status = true;
    } else {
      return "https://fronturl.com/payment?status=success";
    }

    await this.paymentRepository.save(payment);
    return "https://fronturl.com/payment?status=success";
  }
}
