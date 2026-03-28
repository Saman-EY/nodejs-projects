import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), ".env"),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
