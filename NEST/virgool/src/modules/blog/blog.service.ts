import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./enities/blog.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateBlogDto, FilterBlogDto } from "./dto/blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { BadRequestMessage, PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { isArray } from "class-validator";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./enities/blog-category.entity";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity) private blogCategoryRepo: Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}
  // SIDE SERVICES
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepo.findOneBy({ slug });
    return !!blog;
  }

  // MAIN SERVICES
  async create(blogDto: CreateBlogDto) {
    const user = this.request.user!;
    let { title, slug, content, description, image, time_for_study, categories } = blogDto;

    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategoriesData);
    }

    const slugData = slug ?? title;
    slug = createSlug(slugData);
    const isBlogExist = await this.checkBlogBySlug(slug);
    if (isBlogExist) {
      slug += `-${randomId()}`;
    }

    let blog = this.blogRepo.create({
      title,
      content,
      description,
      image,
      time_for_study,
      slug,
      status: BlogStatus.Draft,
      authorId: user.id,
    });

    blog = await this.blogRepo.save(blog);

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }

      await this.blogCategoryRepo.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

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

  async findAll(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const { category } = filterDto;
    let where: FindOptionsWhere<BlogEntity> = {};

    if (category) {
      where.categories = {
        category: {
          title: category,
        },
      };
    }

    const [blogs, count] = await this.blogRepo.findAndCount({
      relations: {
        categories: {
          category: true,
        },
      },
      where,
      select: {
        categories: {
          id: true,
          category: {
            title: true,
          },
        },
      },
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
