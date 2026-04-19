import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { Repository } from "typeorm";
import { BasketDto } from "./dto/basket.dto";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { MenuService } from "../menu/service/menu.service";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private basketRepo: Repository<BasketEntity>,
    @Inject(REQUEST) private req: Request,
    private menuService: MenuService,
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user;
    const { foodId } = basketDto;

    await this.menuService.getOne(foodId);
    let basketItem = await this.basketRepo.findOne({
      where: {
        userId,
        foodId,
      },
    });

    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = await this.basketRepo.create({
        foodId,
        userId,
        count: 1,
      });
    }

    await this.basketRepo.save(basketItem);

    return {
      message: "Added to basket",
    };
  }

  async removeFromBasket() {}
  async getBasket() {}
  async addDiscount() {}
  async removeDiscount() {}
}
