import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./enities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/blog.dto";
import { createSlug } from "src/common/utils/functions.utils";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { PublicMessage } from "src/common/enums/messages.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user!;
    let { title, slug, content, description, image, time_for_study } = blogDto;
    const slugData = slug ?? title;
    slug = createSlug(slugData);

    const blog = this.blogRepo.create({
      title,
      content,
      description,
      image,
      time_for_study,
      slug,
      status: BlogStatus.Draft,
      authorId: user.id,
    });

    await this.blogRepo.save(blog);

    return { message: PublicMessage.Created };
  }
}
