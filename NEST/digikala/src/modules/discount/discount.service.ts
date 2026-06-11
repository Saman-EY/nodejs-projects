import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { toBoolean } from 'src/utils/functions';
import { DiscountEnum, ProductTypeEnum } from 'src/common/enums';
import { DiscountEntity } from './entity/discount.entity';
import { DiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { ProductService } from '../product/services/product.service';
import { domainToASCII } from 'url';
import { UpdateSizeDto } from '../product/dto/size.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private DiscountRepository: Repository<DiscountEntity>,
    private productService: ProductService,
  ) {}

  async create(discountDto: DiscountDto) {
    let { amount, code, expires_in, limit, percent, productId, type } =
      discountDto;

    let discountObject: DeepPartial<DiscountEntity> = { code };

    if (type === DiscountEnum.Product) {
      const product = await this.productService.findOneLean(productId);
      discountObject.productId = productId;
      discountObject.type = DiscountEnum.Product;
    } else {
      discountObject.type = DiscountEnum.Basket;
    }
    if (limit && !isNaN(parseInt(limit.toString())))
      discountObject.limit = +limit;
    if ((amount && percent) || (!amount && !percent)) {
      throw new BadRequestException('Only One Of Amount Or Percent Required!');
    }
    if (amount && isNaN(parseInt(amount.toString()))) {
      throw new BadRequestException('amount should be a number');
    } else if (amount) discountObject.amount = +amount;
    else if (percent && isNaN(parseInt(percent.toString()))) {
      throw new BadRequestException('percent should be a number');
    } else if (percent) discountObject.percent = +percent;

    if (expires_in && new Date(expires_in).toString() === 'Invalid Date') {
      throw new BadRequestException('expires in should be a date');
    } else if (expires_in) discountObject.expires_in = new Date(expires_in);

    const discount = await this.getDiscountByCode(code);

    if (discount) throw new ConflictException('discount already exists!');

    await this.DiscountRepository.save(discountObject);

    return {
      message: 'Discount Created Successfuly!',
    };
  }

  async getDiscountByCode(code: string) {
    const discount = await this.DiscountRepository.findOneBy({ code });
    return discount;
  }

  async update(id: number, discountDto: UpdateDiscountDto) {
    const discount = await this.DiscountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException('Discount Not Found!');

    const { amount, code, expires_in, limit, percent, productId, type } =
      discountDto;

    let discountObject: DeepPartial<DiscountEntity> = { code };

    if (type === DiscountEnum.Product && productId) {
      const product = await this.productService.findOneLean(productId);
      discount.productId = productId;
      discount.type = DiscountEnum.Product;
    } else if (type === DiscountEnum.Basket) {
      discount.type = DiscountEnum.Basket;
    }
    if (limit && !isNaN(parseInt(limit.toString()))) discount.limit = +limit;
    if (amount && percent) {
      throw new BadRequestException('Only One Of Amount Or Percent Required!');
    }
    if (amount && isNaN(parseInt(amount.toString()))) {
      throw new BadRequestException('amount should be a number');
    } else if (amount) discount.amount = +amount;
    else if (percent && isNaN(parseInt(percent.toString()))) {
      throw new BadRequestException('percent should be a number');
    } else if (percent) discount.percent = +percent;

    if (expires_in && new Date(expires_in).toString() === 'Invalid Date') {
      throw new BadRequestException('expires in should be a date');
    } else if (expires_in) discount.expires_in = new Date(expires_in);

    if (code) {
      const discountRow = await this.getDiscountByCode(code);
      if (discountRow && discountRow.id !== id) {
        throw new ConflictException('discount already exists!');
      }
      discount.code = code;
    }

    await this.DiscountRepository.save(discount);

    return {
      message: 'Discount Updated Successfuly!',
    };
  }

  async find() {
    return this.DiscountRepository.find();
  }

  async delete(id: number) {
    const discount = await this.DiscountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException('Discount Not Found!');
    await this.DiscountRepository.delete({ id });
    return {
      message: 'Discount Deleted Successfuly',
    };
  }
}
