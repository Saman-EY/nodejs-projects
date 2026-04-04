import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class ChangeUsernameDto {
  @ApiPropertyOptional()
  @IsString()
  @Length(3, 100)
  username: string;
}
