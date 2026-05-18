import { DiscountEnum } from 'src/common/enums';
import { BasketEntity } from 'src/modules/basket/entities/basket.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('discount')
export class DiscountEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({ unique: true })
  code!: string;
  @Column({ type: 'decimal', nullable: true })
  percent!: number;
  @Column({ type: 'decimal', nullable: true })
  amount!: number;
  @Column({ nullable: true })
  limit!: number;
  @Column({ nullable: true, default: 0 })
  usage!: number;
  @Column({ type: 'timestamp', nullable: true })
  expires_in!: Date;
  @Column({ nullable: true })
  productId!: number;
  @Column({ type: 'enum', enum: DiscountEnum })
  type!: string;

  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets!: BasketEntity[];
}
