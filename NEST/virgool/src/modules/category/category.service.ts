import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { ConflictMessage, NotFoundMessage, PublicMessage } from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/pagination.util";
import { NotFoundError } from "rxjs";

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

  async findOneByTitle(title: string) {
    return await this.categoryRepo.findOneBy({ title });
  }

  async insertByTitle(title: string) {
    const category = this.categoryRepo.create({ title });
    return await this.categoryRepo.save(category);
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

  async findOne(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException(NotFoundMessage.NotFound);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { priority, title } = updateCategoryDto;
    const category = await this.findOne(id);

    if (title) category.title = title;
    if (priority) category.priority = priority;
    await this.categoryRepo.save(category);

    return {
      message: PublicMessage.Updated,
    };
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.categoryRepo.delete({ id });
      return {
        message: PublicMessage.Deleted,
      };
    } catch (error) {
      if (
        error.code === "ER_ROW_IS_REFERENCED_2" ||
        error.message.includes("violates foreign key constraint") ||
        error?.detail.includes("referenced")
      ) {
        throw new BadRequestException(
          `Cannot delete category because it is still in use by one or more blogs. Please disassociate it from blogs first.`,
        );
      }

      throw new InternalServerErrorException(`An unexpected error occurred while deleting category.`);
    }
  }
}
