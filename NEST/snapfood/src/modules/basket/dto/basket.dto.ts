import { ApiProperty } from "@nestjs/swagger";

export class BasketDto {
  @ApiProperty()
  foodId!: number;
}

