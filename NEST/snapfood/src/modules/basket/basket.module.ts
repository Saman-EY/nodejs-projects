import { Module } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { BasketEntity } from "./entities/basket.entity";
import { DiscountEntity } from "../discount/entity/dicount.entity";
import { DiscountService } from "../discount/discount.service";
import { MenuModule } from "../menu/menu.module";

@Module({
  imports: [TypeOrmModule.forFeature([BasketEntity, DiscountEntity]), AuthModule, MenuModule],
  controllers: [BasketController],
  providers: [BasketService, DiscountService],
})
export class BasketModule {}
