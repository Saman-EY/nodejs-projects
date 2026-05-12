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

@Controller('product-detail')
@ApiTags('Product-Detail')
export class ProductDetailController {
  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  create(@Body() detailDto: DetailDto) {}

  @Get('')
  find() {}

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() detailDto: UpdateDetailDto,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {}
}
