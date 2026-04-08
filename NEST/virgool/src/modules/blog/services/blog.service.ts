import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../enities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "../dto/blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "src/common/enums/otherEnums.enum";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { AuthMessage, BadRequestMessage, NotFoundMessage, PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { isArray } from "class-validator";
import { CategoryService } from "../../category/category.service";
import { BlogCategoryEntity } from "../enities/blog-category.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { BlogLikeEntity } from "../enities/like.entity";
import { BlogBookmarkEntity } from "../enities/bookmark.entity";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity) private blogCategoryRepo: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikeEntity) private blogLikeRepo: Repository<BlogLikeEntity>,
    @InjectRepository(BlogBookmarkEntity) private blogBookmarkRepo: Repository<BlogBookmarkEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}
  // SIDE SERVICES
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepo.findOneBy({ slug });
    return blog;
  }

  async checkBlogExistById(id: number) {
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
      // relations: ["likes", "categories", "bookmarks", "comments"],
      relations: {
        likes: true,
        categories: {
          category: true,
        },
        bookmarks: true,
        comments: true,
      },
      select: {
        categories: {
          id: true,
          category: {
            title: true,
            priority: true,
          },
        },
      },
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
      .leftJoin("blog.author", "author")
      .leftJoin("author", "profile")
      .addSelect(["categories.id", "category.title", "author.username", "author.id", "profile.nick_name"])
      .where(where, { category, search })
      .loadRelationCountAndMap("blog.likes", "blog.likes")
      .loadRelationCountAndMap("blog.bookmarks", "blog.bookmarks")
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
  // with ownership

  async delete(id: number) {
    const user = this.request.user!; // for checking blog ownership
    const blog = await this.checkBlogExistById(id);
    if (blog.authorId !== user.id) throw new UnauthorizedException(AuthMessage.Permission);

    await this.blogRepo.delete({ id });

    return {
      message: PublicMessage.Deleted,
    };
  }

  // with ownership
  async update(id: number, blogDto: UpdateBlogDto) {
    const user = this.request.user!; // for checking blog ownership
    let { title, slug, content, description, image, time_for_study, categories } = blogDto;
    const blog = await this.checkBlogExistById(id);
    if (blog.authorId !== user.id) throw new UnauthorizedException(AuthMessage.Permission);

    if (!isArray(categories) && typeof categories === "string") {
      categories = categories.split(",");
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategoriesData);
    }

    let slugData: string | null = null;

    if (title) {
      slugData = title;
      blog.title = title;
    }
    if (slug) slugData = slug;

    if (slugData) {
      slug = createSlug(slugData);
      const isExist = await this.checkBlogBySlug(slug);
      if (isExist && isExist.id !== id) {
        slug += `-${randomId()}`;
      }
      blog.slug = slug;
    }

    if (description) blog.description = description;
    if (content) blog.content = content;
    if (image) blog.image = image;
    if (time_for_study) blog.time_for_study = time_for_study;
    await this.blogRepo.save(blog);
    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepo.delete({ blogId: blog.id });
    }
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

    return {
      message: PublicMessage.Updated,
    };
  }

  async likeToggle(blogId: number) {
    const { id: userId } = this.request.user!;
    await this.checkBlogExistById(blogId);

    const isLiked = await this.blogLikeRepo.findOneBy({ userId, blogId });
    let message = PublicMessage.Like;

    if (isLiked) {
      await this.blogLikeRepo.delete({ id: isLiked.id });
      message = PublicMessage.UnLike;
    } else {
      await this.blogLikeRepo.insert({
        blogId,
        userId,
      });
    }

    return {
      message,
    };
  }

  async bookmarkToggle(blogId: number) {
    const { id: userId } = this.request.user!;
    await this.checkBlogExistById(blogId);

    const isMarked = await this.blogBookmarkRepo.findOneBy({ userId, blogId });
    let message = PublicMessage.Marked;

    if (isMarked) {
      await this.blogBookmarkRepo.delete({ id: isMarked.id });
      message = PublicMessage.UnMarked;
    } else {
      await this.blogBookmarkRepo.insert({
        blogId,
        userId,
      });
    }

    return {
      message,
    };
  }
}
