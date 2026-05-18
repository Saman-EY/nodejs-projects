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
