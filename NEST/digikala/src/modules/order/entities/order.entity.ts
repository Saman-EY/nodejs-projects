import { OrderStatus } from 'src/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItemsEntiy } from './order-items.entity';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';

@Entity('order')
export class OrderEntiy {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status!: string;
  @Column()
  address!: string;
  @Column({ nullable: true })
  paymentId!: number;
  @Column()
  final_amount!: number;
  @Column()
  discount_amount!: number;
  @Column()
  total_amount!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => OrderItemsEntiy, (item) => item.orderId, {
    onDelete: 'CASCADE',
  })
  items!: OrderItemsEntiy;

  @OneToOne(() => PaymentEntity, (payment) => payment.order, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  payment!: PaymentEntity;
}
