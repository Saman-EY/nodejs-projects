import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BlogLike)
export class BlogLikeEntity extends BaseEntity {
  @Column()
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: "CASCADE" })
  user: UserEntity;
  @Column()
  blogId: number;
  @ManyToOne(() => BlogEntity, (blog) => blog.likes, { onDelete: "CASCADE" })
  blog: BlogEntity;
}
