import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketDto } from './dto/create-basket.dto';
import { BasketDiscountDto } from './dto/discount.dto';
import { BasketResult } from 'src/common/types';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get('/get-my-basket')
  getBasket(): Promise<BasketResult> {
    return this.basketService.getBasket();
  }

  @Post('/add')
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
  @Post('/add-discount')
  addDiscountToBasket(@Body() discountDto: BasketDiscountDto) {
    return this.basketService.addCodeToBasket(discountDto);
  }

  @Delete('/remove')
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeBasket(basketDto);
  }
  @Delete('/remove/:id')
  removeFromBasketById(@Param('id', ParseIntPipe) id: number) {
    return this.basketService.removeFromBasketWithId(id);
  }

  @Delete('/remove-discount')
  removeDiscountFromBasket(@Body() discountDto: BasketDiscountDto) {
    return this.basketService.removeCodeFromBasket(discountDto);
  }
}
