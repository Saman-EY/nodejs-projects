import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class SizeDto {
  @ApiProperty()
  size!: string;
  @ApiProperty()
  count!: number;
  @ApiProperty()
  productId!: number;
  @ApiProperty()
  price!: number;
  @ApiPropertyOptional()
  discount!: number;
  @ApiPropertyOptional({type: "boolean"})
  active_discount!: boolean;
}

export class UpdateSizeDto extends PartialType(SizeDto){}
