import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class DetailDto {
  @ApiProperty()
  productId!: number;
  @ApiProperty()
  key!: string;
  @ApiProperty()
  value!: string;

}

export class UpdateDetailDto extends PartialType(DetailDto) {}
