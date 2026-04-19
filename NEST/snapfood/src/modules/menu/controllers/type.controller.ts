import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { TypeService } from "../service/type.service";
import { FormTypes } from "src/common/enums";
import { TypeDto } from "../dto/type.dto";
import { SupplierAuthGuard } from "src/common/decorators/auth.decorator";

@Controller("menu-type")
@ApiTags("Menu-Type")
@SupplierAuthGuard()
export class MenuTypeController {
  constructor(private readonly menuTypeService: TypeService) {}

  @Post()
  @ApiConsumes(FormTypes.UrlEncoded, FormTypes.Json)
  create(@Body() typeDto: TypeDto) {
    return this.menuTypeService.create(typeDto);
  }

  @Get()
  findAll() {
    return this.menuTypeService.findAll();
  }

  @Get("/:id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuTypeService.findOneById(id);
  }

  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuTypeService.remove(id);
  }

  @Put()
  @ApiConsumes(FormTypes.UrlEncoded, FormTypes.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() typeDto: TypeDto) {
    return this.menuTypeService.update(id, typeDto);
  }
}
