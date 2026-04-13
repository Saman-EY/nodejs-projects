import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    UserModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
