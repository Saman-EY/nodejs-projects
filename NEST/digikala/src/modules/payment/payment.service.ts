import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';
import { ZarinpalService } from '../http/zarinpal.service';
import { OrderEntiy } from '../order/entities/order.entity';
import { OrderItemsEntiy } from '../order/entities/order-items.entity';
import { OrderStatus } from 'src/common/enums';
import shortid from 'shortid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntiy)
    private orderRepository: Repository<OrderEntiy>,
    @InjectRepository(OrderItemsEntiy)
    private orderItemsRepository: Repository<OrderItemsEntiy>,
    private basketService: BasketService,
    private zarinpalService: ZarinpalService,
  ) {}

  async create(address: string) {
    const user = { email: 'saman@gmail.com', mobile: '09126107871' };
    const basket = await this.basketService.getBasket();
    let order = this.orderRepository.create({
      final_amount: basket.finalAmount,
      total_amount: basket.totalPrice,
      discount_amount: basket.totalDiscountAmount,
      address,
      status: OrderStatus.Pending,
    });

    order = await this.orderRepository.save(order);
    let orderItems = basket.products.map((product) => {
      return {
        orderId: order.id,
        productId: product.id,
        colorId: product?.colorId,
        sizeId: product?.sizeId,
        count: product?.count,
      };
    });

    await this.orderItemsRepository.insert(orderItems);

    const { authority, gatewayURL } = await this.zarinpalService.sendRequest({
      amount: basket.finalAmount,
      description: 'خرید محصولات فیزیکی',
      user,
    });

    let payment = await this.paymentRepository.create({
      amount: basket.finalAmount,
      authority,
      orderId: order.id,
      invoice_number: shortid.generate(),
      status: false,
    });

    payment = await this.paymentRepository.save(payment);
    order.paymentId = payment.id;
    await this.orderRepository.save(order);

    return { gatewayURL };
  }

  async verify(authority: string, status: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException('payment not found!');
    if (payment?.status)
      throw new BadRequestException('Already verified payment');

    if (status === 'OK') {
      let order = await this.orderRepository.findOneBy({
        id: payment?.orderId,
      });
      if (!order) throw new NotFoundException('order not found!');
      order.status = OrderStatus.Ordered;
      payment.status = true;

      await Promise.all([
        this.paymentRepository.save(payment),
        this.orderRepository.save(order),
      ]);

      return `https://frontendurl.com/payment/success?order_number=${order.id}`;
    } else {
      return 'https://frontendurl.com/payment/failure';
    }
  }

  async find() {
    return this.paymentRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }
}
