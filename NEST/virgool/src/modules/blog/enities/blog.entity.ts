import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogLikeEntity } from "./like.entity";
import { BlogBookmarkEntity } from "./bookmark.entity";
import { BlogCommentEntity } from "./comment.entity";

@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;
  @Column()
  desctription: string;
  @Column()
  content: string;
  @Column({ nullable: true })
  image: string;
  @Column({ default: BlogStatus.Draft })
  status: string;
  @Column()
  authorId: string;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity;

  @OneToMany(() => BlogLikeEntity, (like) => like.blog)
  likes: BlogLikeEntity[];

  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
  bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
  comments: BlogCommentEntity[];

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
