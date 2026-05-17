import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from './product.service';
import { toBoolean } from 'src/utils/functions';
import { ProductEntity } from '../entity/product.entity';
import { ProductTypeEnum } from 'src/common/enums';
import { ProductColorEntity } from '../entity/product-color.entity';
import { ColorDto, UpdateColorDto } from '../dto/color.dto';

@Injectable()
export class ProductColorService {
  constructor(
    @InjectRepository(ProductColorEntity)
    private ProductColorRepo: Repository<ProductColorEntity>,
    @InjectRepository(ProductEntity)
    private productService: ProductService,
    private dataSource: DataSource,
  ) {}

  async create(colorDto: ColorDto) {
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
        color_code,
        color_name,
      } = colorDto;

      let product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productId,
      });

      if (!product) throw new NotFoundException('product not found');

      if (product.type !== ProductTypeEnum.Coloring)
        throw new BadRequestException('Product Type Is Not Valid!');

      await queryRunner.manager.insert(ProductColorEntity, {
        count,
        discount,
        price,
        color_code,
        color_name,
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
        message: 'Product Color Created Successfuly!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
  async update(id: number, colorDto: UpdateColorDto) {
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
        color_code,
        color_name,
      } = colorDto;

      let product = await queryRunner.manager.findOneBy(ProductEntity, {
        id: productId,
      });
      if (!product) throw new NotFoundException('product not found');

      let color = await queryRunner.manager.findOneBy(ProductColorEntity, {
        id,
      });
      if (!color) throw new NotFoundException('product color not found');

      if (active_discount) color.active_discount = active_discount;
      if (price) color.price = price;
      if (discount) color.discount = discount;
      if (color_code) color.color_code = color_code;
      if (color_name) color.color_name = color_name;
      let previousCount = color.count;
      if (count && count > 0) {
        product.count = product.count - previousCount;
        product.count = product.count + count;
        color.count = count;
        await queryRunner.manager.save(ProductColorEntity, color);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        message: 'Product Color Updated Successfuly!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }

  async findOne(id: number) {
    const color = await this.ProductColorRepo.findOne({
      where: { id },
    });
    if (!color) throw new NotFoundException('not found!');
    return color;
  }

  async find(productId: number) {
    console.log("🎸🎸", productId)
    await this.productService.findOneLean(productId);
    const colors = await this.ProductColorRepo.find({
      where: {
        productId,
      },
    });

    return colors;
  }

  async delete(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const color = await queryRunner.manager.findOneBy(ProductColorEntity, {
        id,
      });
      if (!color) throw new NotFoundException('color not found!');
      if (color.count && color.count > 0) {
        const product = await queryRunner.manager.findOneBy(ProductEntity, {
          id: color.productId,
        });
        if (!product) throw new NotFoundException('color not found!');
        product.count = Number(product.count) - Number(color.count);

        await queryRunner.manager.save(ProductEntity, product);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        message: 'Product Color Removed Successfuly!',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
}
