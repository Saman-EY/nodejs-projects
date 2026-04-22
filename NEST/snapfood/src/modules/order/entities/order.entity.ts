import { EntityNames, OrderStatus } from "src/common/enums";
import { AddressEntity } from "src/modules/user/entity/address.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItemEntity } from "./order-items.entity";
import { PaymentEntity } from "src/modules/payment/entities/payment.entity";

@Entity(EntityNames.Order)
export class OrderEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  userId!: number;
  @Column({ nullable: true })
  addressId!: number;
  @Column()
  payment_amount!: number;
  @Column()
  discount_amount!: number;
  @Column()
  total_amount!: number;
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status!: string;
  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: "CASCADE" })
  user!: UserEntity;

  @ManyToOne(() => AddressEntity, (address) => address.orders, { onDelete: "SET NULL" })
  address!: AddressEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items!: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments!: PaymentEntity[]; // for example multi payment or steps for 1 purchase
}
