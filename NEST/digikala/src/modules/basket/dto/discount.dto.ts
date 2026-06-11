import { ApiProperty} from '@nestjs/swagger';

export class BasketDiscountDto {
  @ApiProperty()
  code!: string;
}
