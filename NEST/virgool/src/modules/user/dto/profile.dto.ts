import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";
import { Gender } from "src/common/enums/otherEnums.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  nick_name: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  image_profile: string;
  @ApiPropertyOptional({ nullable: true, format: "binary" })
  bg_image: string;
  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: string;
  @ApiPropertyOptional({ nullable: true, example: "2026-04-01T15:34:07.019Z" })
  birthday: Date;
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;
  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmail })
  email: string;
}
export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhone })
  phone: string;
}
