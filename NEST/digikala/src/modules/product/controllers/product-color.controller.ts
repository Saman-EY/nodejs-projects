import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums';
import { ColorDto, UpdateColorDto } from '../dto/color.dto';
import { ProductColorService } from '../services/product.color.service';

@Controller('product-color')
@ApiTags('Product-Color')
export class ProductColorController {
  constructor(private colorService: ProductColorService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  create(@Body() colorDto: ColorDto) {
    return this.colorService.create(colorDto);
  }

  @Get('/product/:productId')
  find(@Param('productId', ParseIntPipe) productId: number) {
    return this.colorService.find(productId);
  }

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() colorDto: UpdateColorDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.colorService.update(id, colorDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.colorService.delete(id);
  }
}
