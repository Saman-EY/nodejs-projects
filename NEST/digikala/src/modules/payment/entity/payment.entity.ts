import { OrderEntiy } from 'src/modules/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payment')
export class PaymentEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column()
  amount!: number;
  @Column({ default: false })
  status!: boolean;
  @Column()
  invoice_number!: string;
  @Column({ nullable: true })
  refId!: string;
  @Column({ nullable: true })
  authority!: string;
  @Column()
  orderId!: number;
  @CreateDateColumn()
  created_at!: Date;

  @OneToOne(() => OrderEntiy, (order) => order.payment, { onDelete: 'CASCADE' })
  order!: OrderEntiy;
}

