import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendOtpDtp {
  @IsMobilePhone("fa-IR")
  mobile: string;
}

export class CheckOtpDtp {
  @IsMobilePhone("fa-IR", {}, { message: "phone number is invalid" })
  mobile: string;
  @IsString()
  @Length(5, 5, { message: "code is invaalid" })
  code: string;
}
