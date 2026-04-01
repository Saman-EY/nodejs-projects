import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./tokens.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity, OtpEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService],
})
export class AuthModule {}
