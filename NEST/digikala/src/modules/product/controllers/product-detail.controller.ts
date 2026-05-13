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
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { SwaggerConsumes } from 'src/common/enums';
import { DetailDto, UpdateDetailDto } from '../dto/detail.dto';
import { ProductDetailService } from '../services/product-detail.service';

@Controller('product-detail')
@ApiTags('Product-Detail')
export class ProductDetailController {
  constructor(private ProductDetailService: ProductDetailService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  create(@Body() detailDto: DetailDto) {
    return this.ProductDetailService.create(detailDto);
  }

  @Get('/product/:productId')
  find(@Param('productId', ParseIntPipe) productId: number) {
    return this.ProductDetailService.find(productId);
  }

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() detailDto: UpdateDetailDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ProductDetailService.update(id, detailDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ProductDetailService.delete(id);
  }
}
