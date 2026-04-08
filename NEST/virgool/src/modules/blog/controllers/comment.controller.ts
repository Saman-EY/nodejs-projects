import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BlogService } from "../services/blog.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGaurd } from "../../auth/guards/auth.guard";
import { CommentService } from "../services/comment.service";
import { CreateCommentDto } from "../dto/comment.dto";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";

@Controller("blog-comment")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGaurd)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post("/")
  @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
  async create(@Body() commentDto: CreateCommentDto) {
    return this.commentService.create(commentDto);
  }

  @Get("/")
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.commentService.findAll(paginationDto);
  }

  @Put("/accept/:id")
  accept(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.accept(id);
  }
  @Put("/reject/:id")
  reject(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.reject(id);
  }
}
