import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BasketDto } from './dto/create-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductService } from '../product/services/product.service';
import { ProductColorService } from '../product/services/product.color.service';
import { ProductSizeService } from '../product/services/product-size.service';
import { DiscountEnum, ProductTypeEnum } from 'src/common/enums';
import { ProductSizeEntity } from '../product/entity/product-size.entity';
import { ProductColorEntity } from '../product/entity/product-color.entity';
import { DiscountDto } from './dto/discount.dto';
import { DiscountService } from '../discount/discount.service';
import { ProductEntity } from '../product/entity/product.entity';
import { DiscountEntity } from '../discount/entity/discount.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepo: Repository<BasketEntity>,

    private productService: ProductService,
    private productColorService: ProductColorService,
    private productSizeService: ProductSizeService,
    private discountService: DiscountService,
  ) {}

  // SIDES
  validateDiscount(discount: DiscountEntity) {
    let limitCondition = discount.limit && discount.limit > discount.usage;
    let timeCondition = discount.expires_in && discount.expires_in > new Date();

    return limitCondition || timeCondition;
  }

  checkDiscountPercent(price: number, percent: number) {
    let newDiscountAmount = +price * (+percent / 100);
    let newPrice =
      +newDiscountAmount > +price ? 0 : +price - +newDiscountAmount;
    return {
      newPrice,
      newDiscountAmount,
    };
  }

  checkDiscountAmount(price: number, amount: number) {
    let newPrice = +amount > +price ? 0 : +price - +amount;
    return {
      newPrice,
      newDiscountAmount: +amount,
    };
  }

  // MAINS

  async getBasket() {
    let products: any = [];
    let discounts: any = [];
    let finalAmount = 0;
    let totalDiscountAmount = 0;
    let totalPrice = 0;

    const items = await this.basketRepo.find({
      where: {}, // it must set with userId
      relations: {
        product: true,
        color: true,
        size: true,
        discount: true,
      },
    });

    const productDiscounts = items.filter(
      (item) =>
        item?.discountId && item?.discount?.type === DiscountEnum.Product,
    );

    for (const item of items) {
      const { color, product, size, discount, count } = item;
      let discountAmount = 0;

      if (product?.type === ProductTypeEnum.Single) {
        totalPrice += product.price;

        if (product?.active_discount) {
          const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
            product.price,
            discount.percent,
          );

          discountAmount = newDiscountAmount;
          product.price = newPrice;
        }

        const existDiscount = productDiscounts.find(
          (dis) => dis.productId === product.id,
        );
        if (existDiscount) {
          const { discount } = existDiscount;

          if (this.validateDiscount(discount)) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });

            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                product.price,
                discount.percent,
              );

              product.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                product.price,
                discount.amount,
              );

              product.price = newPrice;
              discountAmount += newDiscountAmount;
            }
          }
        }
        totalDiscountAmount += discountAmount;
        finalAmount += product.price * count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          active_discount: product.active_discount,
          price: product.price,
          discount: product.discount,
        } as any);
      } else if (product?.type === ProductTypeEnum.Sizing) {
        totalPrice += size.price;

        if (size?.active_discount) {
          const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
            size.price,
            discount.percent,
          );

          discountAmount = newDiscountAmount;
          size.price = newPrice;
        }

        const existDiscount = productDiscounts.find(
          (dis) => dis.productId === product.id,
        );
        if (existDiscount) {
          const { discount } = existDiscount;

          if (this.validateDiscount(discount)) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });

            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                size.price,
                discount.percent,
              );

              size.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                size.price,
                discount.amount,
              );

              size.price = newPrice;
              discountAmount += newDiscountAmount;
            }
          }
        }
        totalDiscountAmount += discountAmount;
        finalAmount += size.price * count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          active_discount: size.active_discount,
          price: size.price,
          discount: size.discount,
          size: size.size,
        } as any);
      } else if (product?.type === ProductTypeEnum.Coloring) {
        totalPrice += color.price;

        if (color?.active_discount) {
          const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
            color.price,
            discount.percent,
          );

          discountAmount = newDiscountAmount;
          color.price = newPrice;
        }

        const existDiscount = productDiscounts.find(
          (dis) => dis.productId === product.id,
        );
        if (existDiscount) {
          const { discount } = existDiscount;

          if (this.validateDiscount(discount)) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });

            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                color.price,
                discount.percent,
              );

              color.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                color.price,
                discount.amount,
              );

              color.price = newPrice;
              discountAmount += newDiscountAmount;
            }
          }
        }
        totalDiscountAmount += discountAmount;
        finalAmount += color.price * count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          active_discount: color.active_discount,
          price: color.price,
          discount: color.discount,
          color_code: color.color_code,
          color_name: color.color_name,
        } as any);
      } else if (discount) {
        if (this.validateDiscount(discount)) {
          if (discount.type === DiscountEnum.Basket) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });

            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                finalAmount,
                discount.percent,
              );

              finalAmount = newPrice;
              discountAmount = newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                finalAmount,
                discount.amount,
              );

              finalAmount = newPrice;
              discountAmount = newDiscountAmount;
            }
          }
          totalDiscountAmount += discountAmount;
        }
      }
    }

    return {
      totalPrice,
      finalAmount,
      totalDiscountAmount,
      products,
      productDiscounts,
      discounts,
    };
  }

  async addToBasket(basketDto: BasketDto) {
    const { colorId, productId, sizeId } = basketDto;
    let size: ProductSizeEntity | undefined;
    let color: ProductColorEntity | undefined;
    let where: FindOptionsWhere<BasketEntity> = {};
    const product = await this.productService.findOneLean(productId);
    if (product.count === 0)
      throw new BadRequestException('Product Out Of Stock!');
    where.productId = product.id;
    if (product.type === ProductTypeEnum.Coloring && !colorId) {
      throw new BadRequestException('You Must Select A Color!');
    } else if (product.type === ProductTypeEnum.Coloring && colorId) {
      if (isNaN(parseInt(colorId.toString()))) {
        throw new BadRequestException('You Must Select A Color!');
      }
      color = await this.productColorService.findOne(colorId);
      where.colorId = colorId;
    }

    if (product.type === ProductTypeEnum.Sizing && !sizeId) {
      throw new BadRequestException('You Must Select A Size!');
    } else if (product.type === ProductTypeEnum.Sizing && sizeId) {
      if (isNaN(parseInt(sizeId.toString()))) {
        throw new BadRequestException('You Must Select A Size!');
      }
      size = await this.productSizeService.findOne(sizeId);
      where.sizeId = sizeId;
    }

    let basketItem = await this.basketRepo.findOneBy(where);

    if (basketItem) {
      basketItem.count += 1;
      if (basketItem.count > product.count)
        throw new BadRequestException('Product Out Of Stock!');
    } else {
      basketItem = this.basketRepo.create({
        productId,
        sizeId: size?.id,
        colorId: color?.id,
        count: 1,
      });
    }

    await this.basketRepo.save(basketItem);

    return {
      message: 'Product Added To Basket',
    };
  }

  async addCodeToBasket(discountDto: DiscountDto) {
    const { code } = discountDto;
    const discount = await this.discountService.getDiscountByCode(code);
    if (!discount) throw new NotFoundException('Discount Has Not Found');

    if (discount.type === DiscountEnum.Product && discount.productId) {
      const basketItem = await this.basketRepo.findOneBy({
        productId: discount.productId,
      });

      if (!basketItem)
        throw new BadRequestException(
          "Couldn't Find Any Time Acceptable With This Code!",
        );
    }

    if (
      discount.limit &&
      (discount.limit <= 0 || discount.usage >= discount.limit)
    ) {
      throw new BadRequestException('Discount Usage Reached the Limit');
    }

    if (discount.expires_in && discount.expires_in <= new Date()) {
      throw new BadRequestException('Discount Code Expired!');
    }

    const existDiscount = await this.basketRepo.findOneBy({
      discountId: discount.id,
    });

    if (existDiscount) {
      throw new BadRequestException('Discount Already Exists!');
    }

    if (discount.type === DiscountEnum.Basket) {
      const item = await this.basketRepo.findOne({
        relations: {
          discount: true,
        },

        where: {
          discount: {
            type: DiscountEnum.Basket,
          },
        },
      });

      if (item)
        throw new BadRequestException('You ALready Used This Discount!');
    }

    await this.basketRepo.insert({
      productId: discount?.productId,
      discountId: discount.id,
      count: 0,
    });

    return {
      message: 'Discount Added!',
    };
  }

  async removeCodeFromBasket(discountDto: DiscountDto) {
    const { code } = discountDto;
    const discount = await this.discountService.getDiscountByCode(code);
    if (!discount) throw new NotFoundException('Discount Has Not Found');

    const existDiscount = await this.basketRepo.findOneBy({
      discountId: discount.id,
    });

    if (existDiscount) {
      await this.basketRepo.delete({ id: discount.id });
    } else {
      throw new NotFoundException('Discount Has Not Found');
    }

    return {
      message: 'Discount Added!',
    };
  }

  async removeBasket(basketDto: BasketDto) {
    const { colorId, productId, sizeId } = basketDto;
    let size: ProductSizeEntity | undefined;
    let color: ProductColorEntity | undefined;
    let where: FindOptionsWhere<BasketEntity> = {};
    const product = await this.productService.findOneLean(productId);

    where.productId = product.id;
    if (product.type === ProductTypeEnum.Coloring && !colorId) {
      throw new BadRequestException('You Must Select A Color!');
    } else if (product.type === ProductTypeEnum.Coloring && colorId) {
      if (isNaN(parseInt(colorId.toString()))) {
        throw new BadRequestException('You Must Select A Color!');
      }
      color = await this.productColorService.findOne(colorId);
      where.colorId = colorId;
    }

    if (product.type === ProductTypeEnum.Sizing && !sizeId) {
      throw new BadRequestException('You Must Select A Size!');
    } else if (product.type === ProductTypeEnum.Sizing && sizeId) {
      if (isNaN(parseInt(sizeId.toString()))) {
        throw new BadRequestException('You Must Select A Size!');
      }
      size = await this.productSizeService.findOne(sizeId);
      where.sizeId = sizeId;
    }

    let basketItem = await this.basketRepo.findOneBy(where);

    if (basketItem) {
      if (basketItem.count <= 0) {
        await this.basketRepo.delete({ id: basketItem.id });
      } else {
        basketItem.count -= 1;
        await this.basketRepo.save(basketItem);
      }
    } else {
      throw new NotFoundException('Product has not found in basket');
    }

    return {
      message: 'Product Removed From Basket',
    };
  }

  async removeFromBaskterWithId(id: number) {
    let basketItem = await this.basketRepo.findOneBy({ id });

    if (basketItem) {
      if (basketItem.count <= 0) {
        await this.basketRepo.delete({ id: basketItem.id });
      } else {
        basketItem.count -= 1;
        await this.basketRepo.save(basketItem);
      }
    } else {
      throw new NotFoundException('Product has not found in basket');
    }

    return {
      message: 'Product Removed From Basket',
    };
  }
}
