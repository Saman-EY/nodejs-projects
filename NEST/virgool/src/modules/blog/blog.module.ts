import { Module } from "@nestjs/common";
import { BlogService } from "./services/blog.service";
import { BlogController } from "./controllers/blog.controller";
import { AuthModule } from "../auth/auth.module";
import { CategoryService } from "../category/category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./enities/blog.entity";
import { CategoryEntity } from "../category/entities/category.entity";
import { BlogCategoryEntity } from "./enities/blog-category.entity";
import { BlogLikeEntity } from "./enities/like.entity";
import { BlogBookmarkEntity } from "./enities/bookmark.entity";
import { CommentService } from "./services/comment.service";
import { BlogCommentEntity } from "./enities/comment.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryEntity,
      BlogCategoryEntity,
      BlogLikeEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, CategoryService, CommentService],
})
export class BlogModule {}
