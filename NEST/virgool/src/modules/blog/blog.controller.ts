import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/blog.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";
import { AuthGaurd } from "../auth/guards/auth.guard";

@Controller("blog")
@ApiTags("Blog")

export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiBearerAuth("Authorization")
  @UseGuards(AuthGaurd)
  createBlog(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto);
  }
}
