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
import { BasketDiscountDto } from './dto/discount.dto';
import { DiscountService } from '../discount/discount.service';
import { DiscountEntity } from '../discount/entity/discount.entity';
import {
  AppliedDiscount,
  BasketProduct,
  DiscountResult,
} from 'src/common/types';

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
  validateDiscount(discount: DiscountEntity): boolean {
    const limitOk = !discount.limit || +discount.limit > +discount.usage;
    const timeOk =
      !discount.expires_in || new Date(discount.expires_in) > new Date();
    return limitOk && timeOk;
  }

  checkDiscountPercent(price: number, percent: number): DiscountResult {
    const newDiscountAmount = +price * (+percent / 100);
    const newPrice =
      newDiscountAmount > +price ? 0 : +price - newDiscountAmount;
    return { newPrice, newDiscountAmount };
  }

  checkDiscountAmount(price: number, amount: number): DiscountResult {
    const newPrice = +amount > +price ? 0 : +price - +amount;
    return { newPrice, newDiscountAmount: +amount };
  }

  applyDiscount(price: number, discount: DiscountEntity): DiscountResult {
    if (discount.percent) {
      return this.checkDiscountPercent(price, +discount.percent);
    } else if (discount.amount) {
      return this.checkDiscountAmount(price, +discount.amount);
    }
    return { newPrice: price, newDiscountAmount: 0 };
  }

  private formatDiscount(discount: DiscountEntity): AppliedDiscount {
    return {
      code: discount.code,
      type: discount.type,
      percent: discount.percent ? +discount.percent : null,
      amount: discount.amount ? +discount.amount : null,
      productId: discount.productId ?? null,
    };
  }

  // MAINS

  async getBasket() {
    const products: BasketProduct[] = [];
    const discounts: AppliedDiscount[] = [];
    let finalAmount = 0;
    let totalDiscountAmount = 0;
    let totalPrice = 0;

    const items = await this.basketRepo.find({
      where: {}, // TODO: filter by userId
      relations: {
        product: true,
        color: true,
        size: true,
        discount: true,
      },
    });

    // Collect all product-type discount rows in the basket
    const productDiscountItems = items.filter(
      (item) => item.discountId && item.discount?.type === DiscountEnum.Product,
    );

    for (const item of items) {
      const { color, product, size, discount, count } = item;
      let itemPrice = 0;
      let discountAmount = 0;

      // ── Single product ───────────────────────────────────────────────────
      if (product?.type === ProductTypeEnum.Single) {
        itemPrice = +(product.price ?? 0);
        totalPrice += itemPrice;

        // Apply product's built-in discount (active_discount flag)
        if (product.active_discount && product.discount) {
          const result = this.checkDiscountPercent(
            itemPrice,
            +product.discount,
          );
          discountAmount += result.newDiscountAmount;
          itemPrice = result.newPrice;
        }

        // Apply code-based product discount if present in basket
        const productDiscountItem = productDiscountItems.find(
          (d) => d.discount?.productId === product.id,
        );
        if (
          productDiscountItem?.discount &&
          this.validateDiscount(productDiscountItem.discount)
        ) {
          const d = productDiscountItem.discount;
          discounts.push(this.formatDiscount(d));
          const result = this.applyDiscount(itemPrice, d);
          discountAmount += result.newDiscountAmount;
          itemPrice = result.newPrice;
        }

        totalDiscountAmount += discountAmount;
        finalAmount += itemPrice * +count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          count: +count,
          active_discount: product.active_discount,
          price: itemPrice,
          discount: +(product.discount ?? 0),
        });

        // ── Sizing product ───────────────────────────────────────────────────
      } else if (product?.type === ProductTypeEnum.Sizing && size) {
        itemPrice = +(size.price ?? 0);
        totalPrice += itemPrice;

        if (size.active_discount && size.discount) {
          const result = this.checkDiscountPercent(itemPrice, +size.discount);
          discountAmount += result.newDiscountAmount;
          itemPrice = result.newPrice;
        }

        const productDiscountItem = productDiscountItems.find(
          (d) => d.discount?.productId === product.id,
        );
        if (
          productDiscountItem?.discount &&
          this.validateDiscount(productDiscountItem.discount)
        ) {
          const d = productDiscountItem.discount;
          discounts.push(this.formatDiscount(d));
          const result = this.applyDiscount(itemPrice, d);
          discountAmount += result.newDiscountAmount;
          itemPrice = result.newPrice;
        }

        totalDiscountAmount += discountAmount;
        finalAmount += itemPrice * +count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          count: +count,
          active_discount: size.active_discount,
          price: itemPrice,
          discount: +(size.discount ?? 0),
          sizeId: size.id,
          size: size.size,
        });

        // ── Coloring product ─────────────────────────────────────────────────
      } else if (product?.type === ProductTypeEnum.Coloring && color) {
        itemPrice = +(color.price ?? 0);
        totalPrice += itemPrice;

        if (color.active_discount && color.discount) {
          const result = this.checkDiscountPercent(itemPrice, +color.discount);
          discountAmount += result.newDiscountAmount;
          itemPrice = result.newPrice;
        }

        const productDiscountItem = productDiscountItems.find(
          (d) => d.discount?.productId === product.id,
        );
        if (
          productDiscountItem?.discount &&
          this.validateDiscount(productDiscountItem.discount)
        ) {
          const d = productDiscountItem.discount;
          discounts.push(this.formatDiscount(d));
          const result = this.applyDiscount(itemPrice, d);
          discountAmount += result.newDiscountAmount;
          itemPrice = result.newPrice;
        }

        totalDiscountAmount += discountAmount;
        finalAmount += itemPrice * +count;
        products.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          count: +count,
          active_discount: color.active_discount,
          price: itemPrice,
          discount: +(color.discount ?? 0),
          colorId: color.id,
          color_code: color.color_code,
          color_name: color.color_name,
        });

        // ── Basket-level discount row (no product, count = 0) ────────────────
      } else if (!product && discount) {
        if (
          this.validateDiscount(discount) &&
          discount.type === DiscountEnum.Basket
        ) {
          discounts.push(this.formatDiscount(discount));
          const result = this.applyDiscount(finalAmount, discount);
          totalDiscountAmount += result.newDiscountAmount;
          finalAmount = result.newPrice;
        }
      }
    }

    return {
      totalPrice,
      finalAmount,
      totalDiscountAmount,
      products,
      discounts,
    };
  }

  async addToBasket(basketDto: BasketDto) {
    const { colorId, productId, sizeId } = basketDto;
    let size: ProductSizeEntity | undefined;
    let color: ProductColorEntity | undefined;
    const where: FindOptionsWhere<BasketEntity> = {};

    const product = await this.productService.findOneLean(productId);
    if (+product.count === 0)
      throw new BadRequestException('Product Out Of Stock!');

    where.productId = product.id;

    if (product.type === ProductTypeEnum.Coloring) {
      if (!colorId || isNaN(+colorId))
        throw new BadRequestException('You Must Select A Color!');
      color = await this.productColorService.findOne(colorId);
      where.colorId = colorId;
    }

    if (product.type === ProductTypeEnum.Sizing) {
      if (!sizeId || isNaN(+sizeId))
        throw new BadRequestException('You Must Select A Size!');
      size = await this.productSizeService.findOne(sizeId);
      where.sizeId = sizeId;
    }

    let basketItem = await this.basketRepo.findOneBy(where);

    if (basketItem) {
      basketItem.count += 1;
      if (basketItem.count > +product.count)
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
    return { message: 'Product Added To Basket' };
  }

  async addCodeToBasket(discountDto: BasketDiscountDto) {
    const { code } = discountDto;
    const discount = await this.discountService.getDiscountByCode(code);
    if (!discount) throw new NotFoundException('Discount Not Found');

    // Product discount: make sure that product is actually in the basket
    if (discount.type === DiscountEnum.Product && discount.productId) {
      const basketItem = await this.basketRepo.findOneBy({
        productId: discount.productId,
      });
      if (!basketItem)
        throw new BadRequestException(
          'No matching product found in basket for this discount code',
        );
    }

    if (!this.validateDiscount(discount)) {
      if (discount.expires_in && new Date(discount.expires_in) <= new Date()) {
        throw new BadRequestException('Discount Code Expired!');
      }
      throw new BadRequestException('Discount Usage Reached the Limit');
    }

    // Prevent duplicate discount in basket
    const alreadyAdded = await this.basketRepo.findOneBy({
      discountId: discount.id,
    });
    if (alreadyAdded)
      throw new BadRequestException('Discount Already Added To Basket!');

    // Prevent two basket-level discounts
    if (discount.type === DiscountEnum.Basket) {
      const existingBasketDiscount = await this.basketRepo.findOne({
        where: {},
        relations: { discount: true },
      });
      const hasBasketDiscount = (
        await this.basketRepo.find({ relations: { discount: true } })
      ).some((item) => item.discount?.type === DiscountEnum.Basket);

      if (hasBasketDiscount)
        throw new BadRequestException('A basket discount is already applied!');
    }

    await this.basketRepo.insert({
      productId: discount.productId ?? null,
      discountId: discount.id,
      count: 0,
    });

    return { message: 'Discount Added!' };
  }

  async removeCodeFromBasket(discountDto: BasketDiscountDto) {
    const { code } = discountDto;
    const discount = await this.discountService.getDiscountByCode(code);
    if (!discount) throw new NotFoundException('Discount Not Found');

    const basketItem = await this.basketRepo.findOneBy({
      discountId: discount.id,
    });
    if (!basketItem)
      throw new NotFoundException('Discount not found in basket');

    await this.basketRepo.delete({ id: basketItem.id }); // ← fixed: use basketItem.id

    return { message: 'Discount Removed!' };
  }

  async removeBasket(basketDto: BasketDto) {
    const { colorId, productId, sizeId } = basketDto;
    const where: FindOptionsWhere<BasketEntity> = {};

    const product = await this.productService.findOneLean(productId);
    where.productId = product.id;

    if (product.type === ProductTypeEnum.Coloring) {
      if (!colorId || isNaN(+colorId))
        throw new BadRequestException('You Must Select A Color!');
      await this.productColorService.findOne(colorId);
      where.colorId = colorId;
    }

    if (product.type === ProductTypeEnum.Sizing) {
      if (!sizeId || isNaN(+sizeId))
        throw new BadRequestException('You Must Select A Size!');
      await this.productSizeService.findOne(sizeId);
      where.sizeId = sizeId;
    }

    const basketItem = await this.basketRepo.findOneBy(where);
    if (!basketItem)
      throw new NotFoundException('Product has not found in basket');

    if (basketItem.count <= 1) {
      await this.basketRepo.delete({ id: basketItem.id });
    } else {
      basketItem.count -= 1;
      await this.basketRepo.save(basketItem);
    }

    return { message: 'Product Removed From Basket' };
  }

  async removeFromBasketWithId(id: number) {
    const basketItem = await this.basketRepo.findOneBy({ id });
    if (!basketItem)
      throw new NotFoundException('Product has not found in basket');

    if (basketItem.count <= 1) {
      await this.basketRepo.delete({ id: basketItem.id });
    } else {
      basketItem.count -= 1;
      await this.basketRepo.save(basketItem);
    }

    return { message: 'Product Removed From Basket' };
  }
}
