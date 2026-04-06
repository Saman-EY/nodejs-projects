import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./enities/blog.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateBlogDto, FilterBlogDto } from "./dto/blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { BadRequestMessage, NotFoundMessage, PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { isArray } from "class-validator";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./enities/blog-category.entity";
import { EntityNames } from "src/common/enums/entity.enum";

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

  async checkBlogExistById(id) {
    const blog = await this.blogRepo.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFound);
    return blog;
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
    let { category, search } = filterDto;
    let where = "";

    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += " AND ";
      where += "category.title = LOWER(:category)";
    }

    if (search) {
      if (where.length > 0) where += " AND ";
      search = `%${search}%`;
      where += `CONCAT(blog.title, blog.description, blog.content) ILIKE :search`;
    }

    // ADVANCE SEARCH WITH QUERY BUILDER
    const [blogs, count] = await this.blogRepo
      .createQueryBuilder(EntityNames.Blog)
      .leftJoin("blog.categories", "categories")
      .leftJoin("categories.category", "category")
      .addSelect(["categories.id", "category.title"])
      .where(where, { category, search })
      .orderBy("blog.id", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // let where: FindOptionsWhere<BlogEntity> = {};
    // if (category) {
    //   where.categories = {
    //     category: {
    //       title: category,
    //     },
    //   };
    // }

    // const [blogs, count] = await this.blogRepo.findAndCount({
    //   relations: {
    //     categories: {
    //       category: true,
    //     },
    //   },
    //   where,
    //   select: {
    //     categories: {
    //       id: true,
    //       category: {
    //         title: true,
    //       },
    //     },
    //   },
    //   order: {
    //     id: "DESC",
    //   },
    //   skip,
    //   take: limit,
    // });
    return {
      pagination: paginationGenerator(count, limit, page),
      blogs,
    };
  }

  async delete(id: number) {
    await this.checkBlogExistById(id);
    await this.blogRepo.delete({ id });

    return {
      message: PublicMessage.Deleted,
    };
  }
}
