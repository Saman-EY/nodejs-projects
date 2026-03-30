import { ApiProperty } from "@nestjs/swagger";
import { AuthMethod, AuthType } from "../enums";
import { IsEnum, IsString, Length } from "class-validator";

export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: AuthType;
  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: AuthMethod;
}

export class checkOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  code: string;
}
