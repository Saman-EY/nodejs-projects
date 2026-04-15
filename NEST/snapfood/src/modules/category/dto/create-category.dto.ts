import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  slug: string;
  @ApiProperty({format: "binary"})
  image: string;
  @ApiProperty({ default: true })
  show: boolean;
  @ApiPropertyOptional({default: ""})
  parentId: number;
}
