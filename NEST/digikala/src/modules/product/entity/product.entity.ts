import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductDetailEntity } from './product-detail.entity';
import { ProductSizeEntity } from './product-size.entity';
import { ProductColorEntity } from './product-color.entity';
import { ProductTypeEnum } from 'src/common/enums';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  title!: string;
  @Column()
  content!: string;
  @Column()
  slug!: string;
  @Column({ enum: ProductTypeEnum })
  type!: string;
  @Column()
  code!: string;
  @Column({ type: 'decimal', default: 0 })
  count!: number;
  @Column({ type: 'decimal', nullable: true })
  price!: number;
  @Column({ default: 0 })
  discount!: number;
  @Column({ default: false })
  active_discount!: boolean;

  @OneToMany(() => ProductDetailEntity, (detail) => detail.product)
  details!: ProductDetailEntity[];
  @OneToMany(() => ProductSizeEntity, (size) => size.product)
  sizes!: ProductSizeEntity[];
  @OneToMany(() => ProductColorEntity, (color) => color.product)
  colors!: ProductColorEntity[];

  @CreateDateColumn()
  created_at!: Date;
}
