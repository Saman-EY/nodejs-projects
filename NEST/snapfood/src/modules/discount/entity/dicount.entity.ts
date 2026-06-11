import { EntityNames } from "src/common/enums";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.Discount)
export class DiscountEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  code!: string;
  @Column({ nullable: true, type: "decimal" })
  amount!: number;
  @Column({ nullable: true, type: "decimal" })
  percent!: number;
  @Column({ nullable: true })
  expires_in!: Date;
  @Column({ nullable: true })
  limit!: number;
  @Column({ default: 0 })
  usage!: number;
  @Column({ nullable: true })
  supplierId!: number;
  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets!: BasketEntity[];
}
