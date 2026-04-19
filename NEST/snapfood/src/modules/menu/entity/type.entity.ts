import { EntityNames } from "src/common/enums";
import { SupplierEntity } from "src/modules/supplier/entity/supplier.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MenuEntity } from "./menu.entity";

@Entity(EntityNames.Type)
export class TypeEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  title!: string;
  @Column()
  supplierId!: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menuTypes, { onDelete: "CASCADE" })
  supplier!: SupplierEntity;
  @OneToMany(() => MenuEntity, (food) => food.type)
  items!: MenuEntity[];
}
