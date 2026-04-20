import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { BasketService } from "./basket.service";
import { BasketDto } from "./dto/basket.dto";
import { UserAuthGaurd } from "src/common/decorators/auth.decorator";
import { ApiConsumes } from "@nestjs/swagger";
import { FormTypes } from "src/common/enums";
import { DiscountBasketDto } from "../discount/dto/discount.dto";

@Controller("basket")
@UserAuthGaurd()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post("")
  @ApiConsumes(FormTypes.Json, FormTypes.UrlEncoded)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Post("/discount")
  @ApiConsumes(FormTypes.Json, FormTypes.UrlEncoded)
  addDiscountToBasket(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.addDiscount(discountDto);
  }

  @Delete("")
  @ApiConsumes(FormTypes.Json, FormTypes.UrlEncoded)
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }

  @Delete("/discount")
  @ApiConsumes(FormTypes.Json, FormTypes.UrlEncoded)
  removeDiscountFromBasket(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.removeDiscount(discountDto);
  }

  @Get()
  getBasket() {}
}
