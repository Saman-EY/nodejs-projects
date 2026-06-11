import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DiscountEnum } from 'src/common/enums';
import { Type } from 'class-transformer';

export class DiscountDto {
  @ApiProperty()
  code!: string;
  @ApiPropertyOptional()
  // @Type(() => Number)
  percent!: number;
  @ApiPropertyOptional()
  // @Type(() => Number)
  amount!: number;
  @ApiPropertyOptional()
  // @Type(() => Number)
  limit!: number;
  @ApiPropertyOptional()
  expires_in!: string;
  @ApiPropertyOptional()
  // @Type(() => Number)
  productId!: number;
  @ApiPropertyOptional({ enum: DiscountEnum })
  type!: DiscountEnum;
}

export class UpdateDiscountDto extends PartialType(DiscountDto) {}
