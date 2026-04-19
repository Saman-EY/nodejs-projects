import { Module } from "@nestjs/common";
import { MenuService } from "./service/menu.service";
import { MenuController } from "./controllers/menu.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeEntity } from "./entity/type.entity";
import { MenuEntity } from "./entity/menu.entity";
import { FeedbackEntity } from "./entity/feedback.entity";
import { TypeService } from "./service/type.service";
import { FeedbackService } from "./service/feedback.service";
import { SupplierModule } from "../supplier/supplier.module";
import { MenuTypeController } from "./controllers/type.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TypeEntity, MenuEntity, FeedbackEntity]), SupplierModule],
  controllers: [MenuController, MenuTypeController],
  providers: [MenuService, TypeService, FeedbackService],
})
export class MenuModule {}
