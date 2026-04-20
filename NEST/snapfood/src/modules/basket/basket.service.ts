import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BasketEntity } from "./entities/basket.entity";
import { IsNull, Not, Repository } from "typeorm";
import { BasketDto } from "./dto/basket.dto";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { MenuService } from "../menu/service/menu.service";
import { DiscountBasketDto } from "../discount/dto/discount.dto";
import { DiscountService } from "../discount/discount.service";
import { DiscountEntity } from "../discount/entity/dicount.entity";

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private basketRepo: Repository<BasketEntity>,
    @InjectRepository(DiscountEntity) private discountRepo: Repository<DiscountEntity>,
    @Inject(REQUEST) private req: Request,
    private menuService: MenuService,
    private discountService: DiscountService,
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

  async removeFromBasket(basketDto: BasketDto) {
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
      if (basketItem.count <= 1) await this.basketRepo.delete({ id: basketItem.id });
      else {
        basketItem.count -= 1;
        await this.basketRepo.save(basketItem);
      }

      return {
        message: "Item removed from basket",
      };
    }

    throw new BadRequestException("item has not found in basket");
  }

  async getBasket() {}

  // one discount for from admin - one discount for whole supplier
  async addDiscount(discountDto: DiscountBasketDto) {
    const { id: userId } = this.req.user;
    const { code } = discountDto;
    const discount = await this.discountService.findOneByCode(code);

    if (!discount.active) throw new BadRequestException("This Discount Is Not Active");
    if (discount.limit && discount.limit <= discount.usage)
      throw new BadRequestException("This discount has reached its maximum number of uses");

    if (discount.expires_in && discount.expires_in?.getTime() <= new Date().getTime())
      throw new BadRequestException("This discount has been expired");

    const userBasketDiscount = await this.basketRepo.findBy({
      discountId: discount.id,
      userId,
    });

    if (userBasketDiscount) throw new BadRequestException("you already use this discount");

    if (discount.supplierId) {
      const discountOfSupplier = await this.basketRepo.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            supplierId: discount.supplierId,
          },
        },
      });

      if (discountOfSupplier) throw new BadRequestException("You cant use multiple supplier discount!");

      const userBasket = await this.basketRepo.findOne({
        relations: {
          food: true,
        },
        where: {
          userId,
          food: {
            supplierId: discount.supplierId,
          },
        },
      });

      if (!userBasket) throw new BadRequestException("You cant use this code in basket!");
    } else if (!discount.supplierId) {
      const generalDiscount = await this.basketRepo.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            id: Not(IsNull()),
            supplierId: IsNull(),
          },
        },
      });

      if (generalDiscount) throw new BadRequestException("general discount already used!");
    }

    await this.basketRepo.insert({
      discountId: discount.id,
      userId,
    });

    return {
      message: "discount code successfully added",
    };
  }
  async removeDiscount(discountDto: DiscountBasketDto) {
    const { id: userId } = this.req.user;
    const { code } = discountDto;

    const discount = await this.discountService.findOneByCode(code);
    const basketDiscount = await this.basketRepo.findOne({
      where: {
        discountId: discount.id,
      },
    });

    if (!basketDiscount) throw new BadRequestException("basket has not any active discount");

    await this.basketRepo.delete({ discountId: discount.id, userId });

    return {
      message: "you deleted discount code successfuly",
    };
  }
}
