import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductSizeController } from './controllers/product-size.controller';
import { ProductColorController } from './controllers/product-color.controller';
import { ProductDetailController } from './controllers/product-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductColorEntity } from './entity/product-color.entity';
import { ProductDetailEntity } from './entity/product-detail.entity';
import { ProductService } from './services/product.service';
import { ProductDetailService } from './services/product-detail.service';
import { ProductSizeService } from './services/product-size.service';
import { ProductSizeEntity } from './entity/product-size.entity';
import { ProductColorService } from './services/product.color.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductColorEntity,
      ProductDetailEntity,
      ProductColorEntity,
      ProductSizeEntity
    ]),
  ],
  controllers: [
    ProductController,
    ProductSizeController,
    ProductColorController,
    ProductDetailController,
  ],
  providers: [ProductService, ProductDetailService, ProductSizeService, ProductColorService],
  exports: [ProductService, ProductDetailService, ProductSizeService, ProductColorService, TypeOrmModule],
})
export class ProductModule {}
