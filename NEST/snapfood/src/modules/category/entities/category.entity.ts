import { EntityNames } from "src/common/enums";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityNames.Category)
export class CategoryEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column()
  image: string;
  @Column({nullable:true})
  imageKey: string;
  @Column({ default: true })
  show: boolean;
  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.children, { onDelete: "CASCADE" })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent, { onDelete: "CASCADE" })
  // @JoinColumn()
  children: CategoryEntity[];
}
