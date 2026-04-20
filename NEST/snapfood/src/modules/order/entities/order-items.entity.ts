import { EntityNames, OrderItemStatus, OrderStatus } from "src/common/enums";
import { MenuEntity } from "src/modules/menu/entity/menu.entity";
import { AddressEntity } from "src/modules/user/entity/address.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity(EntityNames.OrderItem)
export class OrderItemEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  foodId!: number;
  @Column()
  orderId!: number;
  @Column()
  count!: number;
  @Column()
  supplierId!: number;
  @Column()
  total_amount!: number;
  @Column({ type: "enum", enum: OrderItemStatus, default: OrderItemStatus.Pending })
  status!: string;
  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => MenuEntity, (menu) => menu.orders, { onDelete: "CASCADE" })
  food!: MenuEntity;
  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: "CASCADE" })
  order!: OrderEntity;
}
