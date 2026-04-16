import { EntityNames } from "src/common/enums";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.Supplier)
export class SupplierEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  manager_name: string;
  @Column()
  manager_family: string;
  @Column()
  store_name: string;
  @Column()
  city: string;
  @Column()
  phone: string;
  @Column()
  invite_code: string;
  @Column({ nullable: true })
  agentId: number;
  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, { onDelete: "SET NULL" })
  category: CategoryEntity;

  @OneToMany(() => SupplierEntity, (supplier) => supplier.agent)
  subsets: SupplierEntity[];
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.subsets)
  agent: SupplierEntity;
}
