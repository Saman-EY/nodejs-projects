import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, Length } from "class-validator";

export class CreateCommentDto {
  @ApiProperty()
  @Length(5)
  text: string;
  @ApiProperty()
  @Length(5)
  @IsNumber()
  blogId: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  parentId: number;
}
