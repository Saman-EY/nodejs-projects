import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { DeepPartial, IsNull, Repository } from "typeorm";
import { S3Service } from "../s3/s3.service";
import { isBoolean, paginationGenerator, PaginationSolver, toBoolean } from "src/common/functions";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    private s3service: S3Service,
  ) {}

  // SIDE
  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  // MAIN
  async create(createCategoryDto: CreateCategoryDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3service.uploadFile(image, "snappfood-image");
    let { parentId, show, slug, title } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException("Category Already Exist");
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    let parent: CategoryEntity | null = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(+parentId);
    }
    await this.categoryRepository.insert({
      parentId: parent?.id,
      title,
      show,
      slug,
      image: Location,
      imageKey: Key,
    });
    return {
      message: "Category Created!",
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = PaginationSolver(paginationDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      // where: {},
      // relations: {
      //   parent: true,
      // },
      // select: {
      //   parent: {
      //     title: true,
      //   },
      // },

      where: {
        parentId: IsNull(),
      },
      relations: {
        children: true,
      },
      skip,
      take: limit,
      order: {
        id: "DESC",
      },
    });

    return {
      categories,
      pagination: paginationGenerator(count, limit, page),
    };
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        slug,
      },
      relations: {
        children: true,
      },
    });
    if (!category) throw new NotFoundException("Category Not Found!");

    return {
      category,
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("Category Not Found!");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, image: Express.Multer.File) {
    const { parentId, show, slug, title } = updateCategoryDto;

    const category = await this.findOneById(id);
    let updatedObject: DeepPartial<CategoryEntity> = {};

    if (image) {
      const { Location, Key } = await this.s3service.uploadFile(image, "snappfood-image");
      if (Location) {
        updatedObject.image = Location;
        updatedObject.imageKey = Key;
        if (category.imageKey) await this.s3service.deleteFile(category.imageKey);
      }
    }

    if (title) {
      updatedObject.title = title;
    }
    if (show && isBoolean(show)) {
      updatedObject.show = toBoolean(show);
    }
    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      const category = await this.findOneById(+parentId);
      updatedObject.parentId = category.id;
    }
    if (slug) {
      const category = await this.findOneBySlug(slug);
      if (category && category.id !== id) throw new ConflictException("Category Already Exist!");

      updatedObject.slug = slug;
    }

    await this.categoryRepository.update({ id }, updatedObject);
    return {
      message: "Category Updated!",
    };
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.categoryRepository.delete({ id });

    return {
      message: "Category Removed!",
    };
  }
}
