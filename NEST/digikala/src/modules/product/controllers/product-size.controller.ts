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
import { SizeDto, UpdateSizeDto } from '../dto/size.dto';
import { ProductSizeService } from '../services/product-size.service';

@Controller('product-size')
@ApiTags('Product-Size')
export class ProductSizeController {
  constructor(private sizeService: ProductSizeService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  create(@Body() sizeDto: SizeDto) {
    return this.sizeService.create(sizeDto);
  }

  @Get('/product/:productId')
  find(@Param('productId', ParseIntPipe) productId: number) {
    return this.sizeService.find(productId);
  }

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() sizeDto: UpdateSizeDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sizeService.update(id, sizeDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.sizeService.delete(id);
  }
}
