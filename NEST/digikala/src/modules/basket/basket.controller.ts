import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketDto } from './dto/create-basket.dto';
import { DiscountDto } from './dto/discount.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post('/add')
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
  @Post('/add-discount')
  addDiscountToBasket(@Body() discountDto: DiscountDto) {
    return this.basketService.addCodeToBasket(discountDto)
  }

  @Delete('/remove')
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeBasket(basketDto);
  }
  @Delete('/remove/:id')
  removeFromBasketById(@Param('id', ParseIntPipe) id: number) {
    return this.basketService.removeFromBaskterWithId(id);
  }

  @Delete('/remove-discount')
  removeDiscountFromBasket(@Body() discountDto: DiscountDto) {
    return this.basketService.removeCodeFromBasket(discountDto);
  }
}
