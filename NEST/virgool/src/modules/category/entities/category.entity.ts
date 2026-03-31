import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity {
  @Column()
  title: string;
  @Column({nullable:true})
  priority: number;
}
