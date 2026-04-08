import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../enities/blog.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { CategoryService } from "../../category/category.service";
import { BlogCommentEntity } from "../enities/comment.entity";

@Injectable({ scope: Scope.REQUEST })
export class CommentService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @InjectRepository(BlogCommentEntity) private commentRepo: Repository<BlogCommentEntity>,

    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}



  
}
