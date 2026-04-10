import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateImageDto {
  @ApiProperty({ format: "binary" })
  image: string;
  @ApiPropertyOptional()
  alt: string;
  @ApiProperty()
  name: string;
}
