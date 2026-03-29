import { ApiProperty } from "@nestjs/swagger";

export enum AuthMethod {
  Username = "username",
  Email = "email",
  Phone = "phone",
}

export enum AuthType {
  Login = "login",
  Register = "register",
}
