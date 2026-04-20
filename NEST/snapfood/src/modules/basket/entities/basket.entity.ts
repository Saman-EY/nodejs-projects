import { BasketDiscountType, EntityNames } from "src/common/enums";
import { DiscountEntity } from "src/modules/discount/entity/dicount.entity";
import { MenuEntity } from "src/modules/menu/entity/menu.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.User_Basket)
export class BasketEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  foodId!: number;
  @Column()
  userId!: number;
  @Column()
  count!: number;
  // @Column({ enum: BasketDiscountType, type: "enum", nullable: true })
  // type!: string;
  @Column({ nullable: true })
  discountId!: number;

  @ManyToOne(() => MenuEntity, (food) => food.baskets, { onDelete: "CASCADE" })
  food!: MenuEntity;
  @ManyToOne(() => UserEntity, (user) => user.baskets, { onDelete: "CASCADE" })
  user!: UserEntity;
  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, { onDelete: "CASCADE" })
  discount!: DiscountEntity;
}
