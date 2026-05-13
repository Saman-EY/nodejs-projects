import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entity/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateProductDto } from '../dto/product.dto';
import { ProductTypeEnum } from 'src/common/enums';
import { toBoolean } from 'src/utils/functions';
import { ProductDetailEntity } from '../entity/product-detail.entity';
import { DetailDto, UpdateDetailDto } from '../dto/detail.dto';
import { ProductService } from './product.service';

@Injectable()
export class ProductDetailService {
  constructor(
    @InjectRepository(ProductDetailEntity)
    private ProductDetailRepo: Repository<ProductDetailEntity>,
    private productService: ProductService,
  ) {}

  async create(detailDto: DetailDto) {
    const { key, productId, value } = detailDto;

    await this.productService.findOneLean(productId);
    await this.ProductDetailRepo.insert({ key, value, productId });

    return {
      message: 'Product Detail Created Successfuly!',
    };
  }
  async update(id: number, detailDto: UpdateDetailDto) {
    const { key, productId, value } = detailDto;
    const detail = await this.findOne(id);
    if (productId) {
      await this.productService.findOneLean(productId);
      detail.productId = productId;
    }
    if (key) detail.key = key;
    if (value) detail.value = value;

    await this.ProductDetailRepo.save(detail);

    return {
      message: 'Product Detail Updated Successfuly!',
    };
  }

  async findOne(id: number) {
    const detail = await this.ProductDetailRepo.findOne({
      where: { id },
    });

    if (!detail) throw new NotFoundException('not found!');

    return detail;
  }

  async find(productId: number) {
    await this.productService.findOneLean(productId)
    const details = await this.ProductDetailRepo.find({
      where: {
        productId,
      },
    });

    return details;
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.ProductDetailRepo.delete(id);
    return {
      message: 'Product Detail Removed Successfuly!',
    };
  }
}
