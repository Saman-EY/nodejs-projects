import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from "./modules/auth/auth.module";
import { SupplierModule } from './modules/supplier/supplier.module';
import { MenuModule } from "./modules/menu/menu.module";

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), CategoryModule, AuthModule, SupplierModule, MenuModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
