import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProductTypeEnum } from 'src/common/enums';

export class CreateProductDto {
  @ApiProperty()
  title!: string;
  @ApiProperty()
  content!: string;
  @ApiProperty()
  slug!: string;
  @ApiProperty()
  code!: string;
  @ApiProperty({ enum: ProductTypeEnum })
  type!: string;
  @ApiProperty()
  price!: number;
  @ApiProperty()
  count!: number;
  @ApiProperty()
  discount!: number;
  @ApiProperty()
  active_discount!: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
