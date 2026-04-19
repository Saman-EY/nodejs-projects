import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { MenuService } from "../service/menu.service";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { FormTypes } from "src/common/enums";
import { UploadFileS3 } from "src/common/interceptors/upload.interceptor";
import { FoodDto, UpdateFoodDto } from "../dto/food.dto";
import { SupplierAuthGuard } from "src/common/decorators/auth.decorator";

@Controller("menu")
@ApiTags("Menu")
@SupplierAuthGuard()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

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
    foodDto: FoodDto,
  ) {
    return this.menuService.create(foodDto, image);
  }

  @Patch("/:id")
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
    @Body() foodDto: UpdateFoodDto,
  ) {
    return this.menuService.update(id, foodDto, image);
  }

  @Get("/menu-by-id/:id")
  @SkipAuth()
  findAll(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findAll(id);
  }

  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.delete(id);
  }
}
