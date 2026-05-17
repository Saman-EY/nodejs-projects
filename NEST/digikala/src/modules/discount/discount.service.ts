import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { toBoolean } from 'src/utils/functions';
import { ProductTypeEnum } from 'src/common/enums';

@Injectable()
export class DiscountService {
//   constructor(
//     @InjectRepository(ProductSizeEntity)
//     private ProductSizeRepo: Repository<ProductSizeEntity>,
//     @InjectRepository(ProductEntity)
//     private productService: ProductService,
//     private dataSource: DataSource,
//   ) {}

//   async create(sizeDto: SizeDto) {}
//   async update(id: number, sizeDto: UpdateSizeDto) {}

//   async findOne(id: number) {}

//   async find(productId: number) {}

//   async delete(id: number) {}
}
