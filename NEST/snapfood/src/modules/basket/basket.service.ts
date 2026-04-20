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

  async getBasket() {
    const { id: userId } = this.req.user;

    const basketItems = await this.basketRepo.find({
      relations: {
        discount: true,
        food: {
          supplier: true,
        },
      },

      where: {
        userId,
      },
    });

    const foods = basketItems.filter((item) => item.foodId);
    const supplierDiscounts = basketItems.filter((item) => item.discount.supplierId);
    const generalDiscount = basketItems.find((item) => item.discount.id && !item.discount.supplierId);

    let total_amount = 0;
    let payment_amount = 0;
    let total_discount_amount = 0;
    let foodList: any = [];

    for (const item of foods) {
      let discount_amount = 0;
      let discountCode: string | null = null;
      const { food, count } = item;
      total_amount += food.price * count;
      const supplieId = food.supplierId;

      let foodPrice = food.price * count;

      if (food.is_active && food.discount > 0) {
        discount_amount += foodPrice * (food.discount / 100);
        foodPrice = foodPrice - foodPrice * (food.discount / 100);
      }

      const discountItem = supplierDiscounts.find((item) => item.discount.supplierId === supplieId);

      if (discountItem) {
        const {
          discount: { active, limit, usage, amount, percent, code },
        } = discountItem;
        if (active) {
          if (!limit || (limit && limit > usage)) {
            discountCode = code;
            if (percent && percent > 0) {
              discount_amount += foodPrice * (percent / 100);
              foodPrice = foodPrice - foodPrice * (percent / 100);
            } else if (amount && amount > 0) {
              discount_amount += amount;
              foodPrice = amount > foodPrice ? 0 : foodPrice - amount;
            }
          }
        }
      }

      payment_amount += foodPrice;
      total_discount_amount += discount_amount;
      foodList.push({
        name: food.name,
        description: food.description,
        count,
        image: food.image,
        price: food.price,
        total_amount: food.price * count,
        discount_amount,
        payment_amount: food.price * count - discount_amount,
        discountCode,
        supplierName: food.supplier?.store_name,
        supplierImage: food.supplier?.image,
      });
    }

    let generalDiscountDetail = {};
    if (generalDiscount?.discount?.active) {
      const { discount } = generalDiscount;
      if (discount?.limit && discount.limit > discount.usage) {
        let discount_amount = 0;
        if (discount.percent > 0) {
          discount_amount = payment_amount * (discount.percent / 100);
        } else if (discount.amount > 0) {
          discount_amount = discount.amount;
        }

        payment_amount = discount_amount > payment_amount ? 0 : payment_amount - discount_amount;
        generalDiscountDetail = {
          code: discount.code,
          percent: discount.percent,
          amount: discount.amount,
          discount_amount,
        };
      }
    }

    return {
      total_amount,
      payment_amount,
      total_discount_amount,
      foodList,
      generalDiscountDetail,
    };
  }

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
