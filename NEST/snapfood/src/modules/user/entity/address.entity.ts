import { EntityNames } from "src/common/enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { OrderEntity } from "src/modules/order/entities/order.entity";

@Entity(EntityNames.User_Address)
export class AddressEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  title!: string;
  @Column()
  province!: string;
  @Column()
  city!: string;
  @Column()
  address!: string;
  @Column({ nullable: true })
  postal_code!: string;
  @Column()
  userId!: number;
  @ManyToOne(() => UserEntity, (user) => user.addressList, { onDelete: "CASCADE" })
  user!: UserEntity;
  @OneToMany(() => OrderEntity, (order) => order.address, { onDelete: "SET NULL" })
  orders!: OrderEntity[];

  @CreateDateColumn()
  created_at!: Date;
  @UpdateDateColumn()
  updated_at!: Date;
}
