import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ProductTypeEnum } from 'src/common/enums';

export class DiscountDto {
  @ApiProperty()
  code!: string;
  @ApiPropertyOptional()
  percent!: number;
  @ApiPropertyOptional()
  amount!: number;
  @ApiPropertyOptional()
  limit!: number;
  @ApiPropertyOptional()
  expires_in!: string;
  @ApiPropertyOptional()
  productId!: number;
  @ApiPropertyOptional({ enum: ProductTypeEnum })
  type!: string;
}

export class UpdateDiscountDto extends PartialType(DiscountDto) {}
