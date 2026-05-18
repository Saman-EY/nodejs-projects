import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountEntity } from './entity/discount.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity]), ProductModule],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
