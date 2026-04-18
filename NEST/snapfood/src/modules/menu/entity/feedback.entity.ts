import { EntityNames } from "src/common/enums";
import { SupplierEntity } from "src/modules/supplier/entity/supplier.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeEntity } from "./type.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { MenuEntity } from "./menu.entity";

@Entity(EntityNames.Feedback)
export class FeedbackEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  userId: number;
  @Column()
  foodId: number;
  @Column()
  comment: string;
  @Column()
  score: number;

  @ManyToOne(() => UserEntity, (user) => user.feedbacks, { onDelete: "CASCADE" })
  user: UserEntity;
  @ManyToOne(() => MenuEntity, (food) => food.feedbacks, { onDelete: "CASCADE" })
  food: MenuEntity;

  @CreateDateColumn()
  created_at: Date;
}
