import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { ConflictMessage, PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>) {}

  // SIDE SERVICES
  async checkExistCatTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryRepo.findOneBy({ title });
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }

  // MAIN SERVICES
  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto;
    title = await this.checkExistCatTitle(title);

    const category = this.categoryRepo.create({ priority, title });
    await this.categoryRepo.save(category);

    return {
      message: PublicMessage.Created,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const [categories, count] = await this.categoryRepo.findAndCount({ where: {}, skip, take: limit });
    return {
      pagination: paginationGenerator(count, limit, page),
      categories,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
