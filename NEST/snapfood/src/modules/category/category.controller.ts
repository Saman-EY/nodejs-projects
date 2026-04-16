import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UploadFileS3 } from "src/common/interceptors/upload.interceptor";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FormTypes } from "src/common/enums";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/")
  @ApiConsumes(FormTypes.Multipart)
  @UseInterceptors(UploadFileS3("image"))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // max : 10mb
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get("/")
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get("/by-slug/:slug")
  findbySlug(@Param("slug") slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Get("/:id")
  findOne(@Param("id") id: string) {
    return this.categoryService.findOneById(+id);
  }

  @Patch(":id")
  @ApiConsumes(FormTypes.Multipart)
  @UseInterceptors(UploadFileS3("image"))
  update(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // max : 10mb
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
