import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductDetailEntity } from '../entity/product-detail.entity';
import { UpdateDetailDto } from '../dto/detail.dto';
import { ProductService } from './product.service';
import { SizeDto, UpdateSizeDto } from '../dto/size.dto';
import { ProductSizeEntity } from '../entity/product-size.entity';
import { toBoolean } from 'src/utils/functions';
import { ProductEntity } from '../entity/product.entity';
import { ProductTypeEnum } from 'src/common/enums';

@Injectable()
export class ProductSizeService {
  constructor(
    @InjectRepository(ProductSizeEntity)
    private ProductSizeRepo: Repository<ProductSizeEntity>,
    @InjectRepository(ProductEntity)
    private ProductRepo: Repository<ProductEntity>,
    private productService: ProductService,
    private dataSource: DataSource,
  ) {}

  async create(sizeDto: SizeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      queryRunner.startTransaction();
      const { active_discount, count, discount, price, productId, size } =
        sizeDto;

      let product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productId,
      });

      if (!product) throw new NotFoundException('product not found');

      if (product.type === ProductTypeEnum.Single)
        throw new BadRequestException('Product Type Is Single!');

      await queryRunner.manager.insert(ProductSizeEntity, {
        count,
        discount,
        price,
        size,
        active_discount: toBoolean(active_discount) ?? false,
        productId,
      });
      if (count > 0) {
        product.count = product.count + count;
        await queryRunner.manager.save(ProductEntity, product);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        message: 'Product Size Created Successfuly!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
  async update(id: number, sizeDto: UpdateSizeDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      queryRunner.startTransaction();

      const {
        active_discount,
        count,
        discount,
        price,
        productId,
        size: sizeTitle,
      } = sizeDto;

      let product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productId,
      });
      if (!product) throw new NotFoundException('product not found');

      let size = await queryRunner.manager.findOneBy(ProductSizeEntity, {
        id,
      });
      if (!size) throw new NotFoundException('product not found');

      if (sizeTitle) size.size = sizeTitle;
      if (active_discount) size.active_discount = active_discount;
      if (price) size.price = price;
      if (discount) size.discount = discount;
      let previousCount = size.count;
      if (count && count > 0) {
        product.count = product.count - previousCount;
        product.count = product.count + count;
        size.count = count;
        await queryRunner.manager.save(ProductSizeEntity, size);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        message: 'Product Size Created Successfuly!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }

  
  }

  async findOne(id: number) {
    const size = await this.ProductSizeRepo.findOne({
      where: { id },
    });
    if (!size) throw new NotFoundException('not found!');
    return size;
  }

  async find(productId: number) {
    await this.productService.findOneLean(productId);
    const sizes = await this.ProductSizeRepo.find({
      where: {
        productId,
      },
    });

    return sizes;
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.ProductSizeRepo.delete(id);

    return {
      message: 'Product Size Removed Successfuly!',
    };
  }
}
