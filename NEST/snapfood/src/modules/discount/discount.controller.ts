import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { SupplierAuthGuard } from "src/common/decorators/auth.decorator";
import { DiscountService } from "./discount.service";
import { ApiConsumes } from "@nestjs/swagger";
import { FormTypes } from "src/common/enums";
import { DiscountDto } from "./dto/discount.dto";

@Controller("discount")
@SupplierAuthGuard()
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiConsumes(FormTypes.Json, FormTypes.UrlEncoded)
  create(@Body() discountDto:DiscountDto) {
    return this.discountService.create(discountDto);
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Delete("/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.remove(id);
  }
}
