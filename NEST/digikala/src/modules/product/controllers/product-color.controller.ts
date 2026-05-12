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
import { ColorDto, UpdateColorDto } from '../dto/color.dto';

@Controller('product-color')
@ApiTags('Product-Color')
export class ProductColorController {
  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  create(@Body() colorDto: ColorDto) {}

  @Get('')
  find() {}

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() colorDto: UpdateColorDto,
    @Param('id', ParseIntPipe) id: number,
  ) {}

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {}
}
