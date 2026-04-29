import { EntityNames, OrderItemStatus, OrderStatus } from "src/common/enums";
import { MenuEntity } from "src/modules/menu/entity/menu.entity";
import { OrderEntity } from "src/modules/order/entities/order.entity";
import { AddressEntity } from "src/modules/user/entity/address.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.Payment)
export class PaymentEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column({ default: false })
  status!: boolean;
  @Column()
  amount!: number;
  @Column()
  invoice_number!: string;
  @Column({ nullable: true })
  authority!: string;
  @Column()
  userId!: number;
  @Column()
  orderId!: number;

  @ManyToOne(() => OrderEntity, (order) => order.payments, { onDelete: "CASCADE" })
  order!: OrderEntity;
  @ManyToOne(() => UserEntity, (menu) => menu.payments, { onDelete: "CASCADE" })
  user!: UserEntity;

  @CreateDateColumn()
  created_at!: Date;
}
