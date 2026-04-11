import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {}

export class BanDto {
  @ApiProperty()
  userId: number;
}
