import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../enities/blog.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { CategoryService } from "../../category/category.service";
import { BlogCommentEntity } from "../enities/comment.entity";
import { CreateCommentDto } from "../dto/comment.dto";
import { BlogService } from "./blog.service";
import { BadRequestMessage, NotFoundMessage, PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class CommentService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @InjectRepository(BlogCommentEntity) private commentRepo: Repository<BlogCommentEntity>,

    @Inject(REQUEST) private request: Request,
    private blogService: BlogService,
  ) {}

  // SIDE SERVICES
  async checkExistById(id: number) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException(NotFoundMessage.NotFound);
    return comment;
  }

  // MAIN SERVICES
  async create(commentDto: CreateCommentDto) {
    const { id: userId } = this.request.user!;
    const { text, blogId, parentId } = commentDto;

    await this.blogService.checkBlogExistById(blogId);

    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = (await this.commentRepo.findOneBy({ id: +parentId })) as any;
    }

    await this.commentRepo.insert({
      text,
      accepted: true,
      blogId,
      parentId: parent ? parentId : (null as any),
      userId,
    });

    return {
      message: PublicMessage.Created,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const [comments, count] = await this.commentRepo.findAndCount({
      where: {},
      relations: {
        blog: true,
        user: {
          profile: true,
        },
      },
      select: {
        blog: {
          title: true,
        },
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
      },
      skip,
      take: limit,
      order: { id: "DESC" },
    });

    return {
      pagination: paginationGenerator(count, limit, page),
      comments,
    };
  }

  async accept(id: number) {
    const comment = await this.checkExistById(id);

    if (comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyAccepted);
    comment.accepted = true;

    await this.commentRepo.save(comment);

    return {
      message: PublicMessage.Updated,
    };
  }

  async reject(id: number) {
    const comment = await this.checkExistById(id);

    if (!comment.accepted) throw new BadRequestException(BadRequestMessage.AlreadyRejected);
    comment.accepted = false;

    await this.commentRepo.save(comment);

    return {
      message: PublicMessage.Updated,
    };
  }
}
