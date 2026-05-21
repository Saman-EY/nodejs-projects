import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BasketService } from '../basket/basket.service';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { ZarinpalService } from '../http/zarinpal.service';
import { HttpApiModule } from '../http/http.module';
import { OrderItemsEntiy } from '../order/entities/order-items.entity';
import { OrderEntiy } from '../order/entities/order.entity';
import { BasketEntity } from '../basket/entities/basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, OrderItemsEntiy, OrderEntiy, BasketEntity]),
    ProductModule,
    DiscountModule,
    HttpApiModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, BasketService],
})
export class PaymentModule {}
