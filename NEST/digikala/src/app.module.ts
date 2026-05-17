import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { ProductModule } from './modules/product/product.module';
import { DiscountModule } from './modules/discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    ProductModule,
    DiscountModule,
  ],
})
export class AppModule {}
