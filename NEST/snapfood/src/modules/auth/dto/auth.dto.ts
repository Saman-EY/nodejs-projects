import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNumber, IsString, Length } from "class-validator";

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR")
  mobile!: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "phone number is invalid" })
  mobile!: string;
  @IsNumber()
  @ApiProperty()
  // @Length(5, 5, { message: "code is invalid" }) // works for string type
  code!: number;
}
