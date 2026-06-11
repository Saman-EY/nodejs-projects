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
import { DiscountService } from './discount.service';
import { DiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post('')
  @ApiConsumes(SwaggerConsumes.Json)
  create(@Body() discountDto: DiscountDto) {
    return this.discountService.create(discountDto);
  }
  
  @Get('')
  find() {
    return this.discountService.find();
  }

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  update(
    @Body() discountDto: UpdateDiscountDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.discountService.update(id, discountDto);
  }
  @Delete('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }
}
