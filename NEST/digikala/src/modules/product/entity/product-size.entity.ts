import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

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
  @ManyToOne(() => ProductEntity, (product) => product.sizes, {onDelete: "CASCADE"})
  product!: ProductEntity;
}
