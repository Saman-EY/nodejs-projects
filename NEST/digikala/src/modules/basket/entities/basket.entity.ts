import { DiscountEntity } from 'src/modules/discount/entity/discount.entity';
import { ProductColorEntity } from 'src/modules/product/entity/product-color.entity';
import { ProductSizeEntity } from 'src/modules/product/entity/product-size.entity';
import { ProductEntity } from 'src/modules/product/entity/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('basket')
export class BasketEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({ nullable: true })
  productId!: number;
  @Column({ nullable: true })
  colorId!: number;
  @Column({ nullable: true })
  sizeId!: number;
  @Column({ nullable: true })
  discountId!: number;

  @Column()
  count!: number;

  @ManyToOne(() => ProductEntity, (product) => product.baskets, {
    onDelete: 'CASCADE',
  })
  product!: ProductEntity;

  @ManyToOne(() => ProductColorEntity, (color) => color.baskets, {
    onDelete: 'CASCADE',
  })
  color!: ProductColorEntity;

  @ManyToOne(() => ProductSizeEntity, (size) => size.baskets, {
    onDelete: 'CASCADE',
  })
  size!: ProductSizeEntity;
  
  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: 'CASCADE',
  })
  discount!: DiscountEntity;
}
