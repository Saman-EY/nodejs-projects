import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product-detail')
export class ProductDetailEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  productId!: number;
  @Column()
  key!: string;
  @Column()
  value!: string;

  @ManyToOne(() => ProductEntity, (product) => product.details, {onDelete: "CASCADE"})
  product!: ProductEntity;
}
