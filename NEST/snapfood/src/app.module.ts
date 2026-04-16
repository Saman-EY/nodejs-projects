import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from "./modules/auth/auth.module";
import { SupplierModule } from './modules/supplier/supplier.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), CategoryModule, AuthModule, SupplierModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
