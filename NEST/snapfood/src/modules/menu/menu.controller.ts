import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MenuService } from "./service/menu.service";

@Controller("menu")
@ApiTags("Menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
}
