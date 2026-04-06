import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./enities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}
  // SIDE SERVICES
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepo.findOneBy({ slug });
    return !!blog;
  }

  // MAIN SERVICES
  async create(blogDto: CreateBlogDto) {
    const user = this.request.user!;
    let { title, slug, content, description, image, time_for_study } = blogDto;
    const slugData = slug ?? title;
    slug = createSlug(slugData);
    const isBlogExist = await this.checkBlogBySlug(slug);
    if (isBlogExist) {
      slug += `-${randomId()}`;
    }

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

  async getMyBlogs() {
    const { id } = this.request.user!;
    const blogs = await this.blogRepo.find({
      where: { authorId: id },
      order: {
        id: "DESC",
      },
    });
    return blogs;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [blogs, count] = await this.blogRepo.findAndCount({
      where: {},
      order: {
        id: "DESC",
      },
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, limit, page),
      blogs,
    };
  }
}
