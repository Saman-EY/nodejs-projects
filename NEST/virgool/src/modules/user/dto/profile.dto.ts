import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, Length } from "class-validator";
import { Gender } from "src/common/enums/otherEnums.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional({ nullable: true })
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  image_profile: string;
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  bg_image: string;
  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsEnum(Gender)
  gender: string;
  @ApiPropertyOptional({ nullable: true, example: "2026-04-01T15:34:07.019Z" })
  birthday: Date;
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;
  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
}
