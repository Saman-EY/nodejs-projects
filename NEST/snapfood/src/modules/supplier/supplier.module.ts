import { Module } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { SupplierController } from "./supplier.controller";
import { JwtService } from "@nestjs/jwt";
import { CategoryService } from "../category/category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupplierEntity } from "./entity/supplier.entity";
import { S3Service } from "../s3/s3.service";
import { SupplierOtpEntity } from "./entity/otp.entity";
import { CategoryEntity } from "../category/entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity, SupplierOtpEntity, CategoryEntity])],
  controllers: [SupplierController],
  providers: [SupplierService, JwtService, CategoryService, S3Service],
  exports: [SupplierService, JwtService,S3Service, TypeOrmModule]
})
export class SupplierModule {}
