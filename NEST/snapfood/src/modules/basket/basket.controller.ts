import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketDto } from "./dto/basket.dto";
import { UserAuthGaurd } from "src/common/decorators/auth.decorator";
import { ApiConsumes } from "@nestjs/swagger";
import { FormTypes } from "src/common/enums";

@Controller("basket")
@UserAuthGaurd()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  @ApiConsumes(FormTypes.Json, FormTypes.UrlEncoded)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
  @Delete()
  removeFromBasket() {}
  @Get()
  getBasket() {}
}
