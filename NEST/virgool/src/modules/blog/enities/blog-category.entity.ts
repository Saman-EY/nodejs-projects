import { BaseEntity } from "src/common/abstracts/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { EntityNames } from "src/common/enums/entity.enum";

@Entity(EntityNames.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
  @Column()
  blogId: number;
  @Column()
  categoryId: number;
  @ManyToOne(() => BlogEntity, (blog) => blog.categories, { onDelete: "CASCADE" })
  blog: BlogEntity;
  @ManyToOne(() => CategoryEntity, (category) => category.blog_category) // we can use cascade for deleting category entity
  category: CategoryEntity;
}
