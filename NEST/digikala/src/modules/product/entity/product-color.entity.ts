import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product-color')
export class ProductColorEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  productId!: number;
  @Column()
  color_name!: string;
  @Column()
  color_code!: string;
  @Column()
  count!: number;
  @Column({ type: 'decimal', default: 0 })
  price!: number;
  @Column({ type: 'decimal', default: 0 })
  discount!: number;
  @Column({ default: false })
  active_discount!: boolean;
  @ManyToOne(() => ProductEntity, (product) => product.colors, {
    onDelete: 'CASCADE',
  })
  product!: ProductEntity;
}
