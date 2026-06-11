import { EntityNames } from "src/common/enums";
import { SupplierEntity } from "src/modules/supplier/entity/supplier.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeEntity } from "./type.entity";
import { FeedbackEntity } from "./feedback.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { OrderItemEntity } from "src/modules/order/entities/order-items.entity";

@Entity(EntityNames.Menu)
export class MenuEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  name!: string;
  @Column({ type: "decimal" })
  price!: number;
  @Column({ type: "decimal", default: 0 })
  discount!: number;
  @Column({ default: false })
  is_active!: boolean;
  @Column({ type: "decimal", nullable: true })
  score!: number;
  @Column()
  image!: string;
  @Column()
  key!: string;
  @Column()
  description!: string;
  @Column()
  typeId!: number;
  @Column()
  supplierId!: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menu, { onDelete: "CASCADE" })
  supplier!: SupplierEntity;
  @ManyToOne(() => TypeEntity, (type) => type.items)
  type!: TypeEntity;
  @OneToMany(() => FeedbackEntity, (feedback) => feedback.food)
  feedbacks!: FeedbackEntity[];
  @OneToMany(() => BasketEntity, (basket) => basket.food)
  baskets!: BasketEntity[];
  @OneToMany(() => OrderItemEntity, (item) => item.food)
  orders!: OrderItemEntity[];
}
