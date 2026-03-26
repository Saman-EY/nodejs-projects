import { IsMobilePhone, IsNumber, IsString, Length } from "class-validator";

export class SendOtpDto {
  @IsMobilePhone("fa-IR")
  mobile: string;
}

export class CheckOtpDto {
  @IsMobilePhone("fa-IR", {}, { message: "phone number is invalid" })
  mobile: string;
  @IsNumber()
  // @Length(5, 5, { message: "code is invalid" }) // works for string type
  code: number;
}
