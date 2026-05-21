import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntiy } from './order.entity';
import { ProductEntity } from 'src/modules/product/entity/product.entity';
import { ProductSizeEntity } from 'src/modules/product/entity/product-size.entity';
import { ProductColorEntity } from 'src/modules/product/entity/product-color.entity';

@Entity('order-items')
export class OrderItemsEntiy {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  orderId!: number;
  @Column()
  productId!: number;
  @Column({ nullable: true })
  colorId!: number;
  @Column({ nullable: true })
  sizeId!: number;
  @Column({ nullable: true })
  count!: number;

  @ManyToOne(() => OrderEntiy, (order) => order.items)
  order!: OrderEntiy;
  @ManyToOne(() => ProductEntity, (product) => product.order_items)
  product!: ProductEntity;
  @ManyToOne(() => ProductSizeEntity, (size) => size.order_items)
  size!: ProductSizeEntity;
  @ManyToOne(() => ProductColorEntity, (color) => color.order_items)
  color!: ProductColorEntity;
}
