import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
