import { Module } from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscountEntity } from "./entity/dicount.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
