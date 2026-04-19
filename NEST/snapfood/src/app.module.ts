import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "./configs/typeorm.config";
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from "./modules/auth/auth.module";
import { SupplierModule } from './modules/supplier/supplier.module';
import { MenuModule } from "./modules/menu/menu.module";
import { BasketModule } from './modules/basket/basket.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig()), CategoryModule, AuthModule, SupplierModule, MenuModule, BasketModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
