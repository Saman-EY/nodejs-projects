import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './modules/product/product.module';
import { DiscountModule } from './modules/discount/discount.module';
import { BasketModule } from './modules/basket/basket.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    ProductModule,
    DiscountModule,
    BasketModule,
    OrderModule,
    PaymentModule,
  ],
})
export class AppModule {}
