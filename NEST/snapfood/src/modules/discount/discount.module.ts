import { Module } from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscountEntity } from "./entity/dicount.entity";
import { SupplierService } from "../supplier/supplier.service";
import { SupplierEntity } from "../supplier/entity/supplier.entity";
import { SupplierOtpEntity } from "../supplier/entity/otp.entity";
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { AuthModule } from "../auth/auth.module";
import { S3Service } from "../s3/s3.service";

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity, SupplierEntity, SupplierOtpEntity, CategoryEntity]), AuthModule],
  controllers: [DiscountController],
  providers: [DiscountService, SupplierService, CategoryService, S3Service],
})
export class DiscountModule {}
