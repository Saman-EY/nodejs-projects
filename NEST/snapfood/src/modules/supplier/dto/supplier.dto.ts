import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIdentityCard, IsMobilePhone } from "class-validator";

export class SupplierDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  store_name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  manager_name: string;
  @ApiProperty()
  manager_family: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "mobile number is invalid" })
  phone: string;
  @ApiProperty()
  invite_code: string;
}

export class SupplementaryInfoDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsIdentityCard("IR")
  national_code: string;
}
export class UploadDocsDto {
  @ApiProperty({ format: "binary" })
  acceptedDoc: string;
  @ApiProperty({ format: "binary" })
  image: string;
}
