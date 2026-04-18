import { EntityNames, SupplierStatus } from "src/common/enums";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SupplierOtpEntity } from "./otp.entity";

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
  @Column({ nullable: true })
  national_code: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  document: string;
  @Column({ nullable: true, default: SupplierStatus.Registered })
  status: string;

  @Column({ default: false })
  mobile_verified: boolean;

  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, { onDelete: "SET NULL" })
  category: CategoryEntity;

  @OneToMany(() => SupplierEntity, (supplier) => supplier.agent)
  subsets: SupplierEntity[];
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.subsets)
  agent: SupplierEntity;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => SupplierOtpEntity, (otp) => otp.supplier, { onDelete: "SET NULL" })
  @JoinColumn({name: "otpId"})
  supplier_otp: SupplierOtpEntity;
}
