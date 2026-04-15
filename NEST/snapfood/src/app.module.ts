import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), CategoryModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
