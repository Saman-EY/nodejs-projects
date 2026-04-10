import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BlogService } from "../services/blog.service";
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from "../dto/blog.dto";
import { ApiBearerAuth, ApiConsumes, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import { AuthGaurd } from "../../auth/guards/auth.guard";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { FilterBlog } from "src/common/decorators/filter.decorator";

@Controller("blog")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGaurd)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createBlog(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto);
  }

  @Get("/my-blogs")
  myblogs() {
    return this.blogService.getMyBlogs();
  }

  @Get("")
  @Pagination()
  @FilterBlog()
  @SkipAuth()
  find(@Query() paginationDto: PaginationDto, @Query() filterDto: FilterBlogDto) {
    return this.blogService.findAll(paginationDto, filterDto);
  }

  @Get("/by-slug/:slug")
  @SkipAuth()
  @Pagination()
  findOnBySlug(@Param("slug") slug: string, @Query() paginationDto: PaginationDto) {
    return this.blogService.findOneBySlug(slug, paginationDto);
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.delete(id);
  }

  @Put("/:id")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateDto: UpdateBlogDto) {
    return this.blogService.update(id, updateDto);
  }

  @Put("/like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id);
  }

  @Put("/bookmark/:id")
  bookmaarkToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggle(id);
  }
}
