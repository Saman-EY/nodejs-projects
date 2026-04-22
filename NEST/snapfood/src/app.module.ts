import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { CategoryModule } from "./modules/category/category.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SupplierModule } from "./modules/supplier/supplier.module";
import { MenuModule } from "./modules/menu/menu.module";
import { BasketModule } from "./modules/basket/basket.module";
import { OrderModule } from "./modules/order/order.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { DiscountModule } from "./modules/discount/discount.module";
import { HttpApiModule } from "./modules/http/http.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    BasketModule,
    CategoryModule,
    DiscountModule,
    MenuModule,
    OrderModule,
    PaymentModule,
    SupplierModule,
    HttpApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
