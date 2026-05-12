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
import { SizeDto, UpdateSizeDto } from '../dto/size.dto';

@Controller('product-size')
@ApiTags('Product-Size')
export class ProductSizeController {
  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  create(@Body() sizeDto: SizeDto) {}

  @Get('')
  find() {}

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() sizeDto: UpdateSizeDto,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {}
}
