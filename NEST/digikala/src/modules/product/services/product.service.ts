import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entity/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProductTypeEnum } from 'src/common/enums';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private ProductRepo: Repository<ProductEntity>,
  ) {}

  async create(productDto: CreateProductDto) {
    const {
      active_discount,
      code,
      content,
      count,
      discount,
      price,
      slug,
      title,
      type,
    } = productDto;

    const porudctObj: DeepPartial<ProductEntity> = {
      title,
      content,
      slug,
      code,
      discount,
      active_discount,
    };

    if (type === ProductTypeEnum.Single) {
      Object.assign(porudctObj, { price, code, type });
    } else if (
      [ProductTypeEnum.Coloring, ProductTypeEnum.Sizing].includes(type as any)
    ) {
      porudctObj['type'] = type;
    } else {
      throw new BadRequestException('Type Invalid');
    }

    await this.ProductRepo.save(porudctObj);
    return {
      message: 'Product Created Successfuly!',
    };
  }
  async update(id: number, productDto: UpdateProductDto) {
    const {
      active_discount,
      code,
      content,
      count,
      discount,
      price,
      slug,
      title,
      type,
    } = productDto;

    const product = await this.findOneLean(id);
    if (title) product.title = title;
    if (slug) product.slug = slug;
    if (content) product.content = content;
    if (discount) product.discount = discount;
    if (active_discount) product.active_discount = active_discount;
    if (code) product.code = code;
    if (type === ProductTypeEnum.Single) {
      Object.assign(product, { price, code });
    }

    await this.ProductRepo.save(product);
    return {
      message: 'Product Updated Successfuly!',
    };
  }

  async find() {
    return this.ProductRepo.find({
      where: {},
      relations: { colors: true, sizes: true, details: true },
    });
  }

  async findOne(id: number) {
    const product = await this.ProductRepo.findOne({
      where: { id },
      relations: { colors: true, sizes: true, details: true },
    });

    if (!product) throw new NotFoundException('not found!');

    return product;
  }

  async findOneLean(id: number) {
    const product = await this.ProductRepo.findOne({
      where: { id },
    });

    if (!product) throw new NotFoundException('not found!');

    return product;
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.ProductRepo.delete({ id });
    return {
      message: 'Deleted Product Successfuly.',
    };
  }
}
