import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { ImageService } from "./image.service";
import { CreateImageDto } from "./dto/create-image.dto";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { UploadFile } from "src/common/interceptors/upload.interceptor";
import type { MulterFile } from "src/common/utils/multer.util";
import { ApiConsumes } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger.enum";

@Controller("image")
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(UploadFile("image"))
  @ApiConsumes(SwaggerConsumes.MultiPartData)
  create(@Body() imageDto: CreateImageDto, @UploadedFile() image: MulterFile) {
    return this.imageService.create(imageDto,image);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.imageService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.imageService.remove(+id);
  }
}
