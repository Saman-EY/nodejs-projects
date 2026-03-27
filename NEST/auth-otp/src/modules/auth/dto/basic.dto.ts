import { IsEmail, IsMobilePhone, IsString, Length } from "class-validator";

export class SignUpDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsMobilePhone("fa-IR", {}, { message: "invalid phone number" })
  mobile: string;
  @IsString()
  @IsEmail({}, { message: "email is not valid" })
  email: string;
  @IsString()
  @Length(6, 20, { message: "your password is incorrect! (6 - 20 charecters needed)" })
  password: string;
  @IsString()
  confirmPassword: string;
}

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: "email is not valid" })
  email: string;
  @IsString()
  @Length(6, 20, { message: "your password is incorrect! (6 - 20 charecters needed)" })
  password: string;
}
