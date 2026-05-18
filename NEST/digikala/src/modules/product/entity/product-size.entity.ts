import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { BasketEntity } from 'src/modules/basket/entities/basket.entity';

@Entity('product-size')
export class ProductSizeEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  productId!: number;
  @Column()
  size!: string;
  @Column()
  count!: number;
  @Column({ type: 'decimal', default: 0 })
  price!: number;
  @Column({ type: 'decimal', default: 0 })
  discount!: number;
  @Column({ default: false })
  active_discount!: boolean;
  @ManyToOne(() => ProductEntity, (product) => product.sizes, {
    onDelete: 'CASCADE',
  })
  product!: ProductEntity;

  @OneToMany(() => BasketEntity, (basket) => basket.size)
  baskets!: BasketEntity[];
}
