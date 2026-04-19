import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SupplierEntity } from "./supplier.entity";
import { EntityNames } from "src/common/enums";

@Entity(EntityNames.SupplierOtp)
export class SupplierOtpEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  code!: number;
  @Column()
  expires_in!: Date;
  @Column()
  supplierId!: number;
  @OneToOne(() => SupplierEntity, (supplier) => supplier.supplier_otp, { onDelete: "CASCADE" })
  supplier!: SupplierEntity;
}
