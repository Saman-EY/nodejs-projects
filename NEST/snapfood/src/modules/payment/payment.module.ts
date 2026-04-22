import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { BasketService } from "../basket/basket.service";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BasketEntity } from "../basket/entities/basket.entity";
import { DiscountEntity } from "../discount/entity/dicount.entity";
import { MenuService } from "../menu/service/menu.service";
import { DiscountService } from "../discount/discount.service";
import { MenuEntity } from "../menu/entity/menu.entity";
import { TypeEntity } from "../menu/entity/type.entity";
import { TypeService } from "../menu/service/type.service";
import { S3Service } from "../s3/s3.service";
import { ZarinpalService } from "../http/zarinpal.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([BasketEntity, DiscountEntity, MenuEntity, TypeEntity])],
  controllers: [PaymentController],
  providers: [PaymentService, BasketService, MenuService, DiscountService, TypeService, S3Service],
})
export class PaymentModule {}
