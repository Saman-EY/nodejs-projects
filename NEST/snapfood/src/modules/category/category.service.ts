import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { S3Service } from "../s3/s3.service";
import { isBoolean, toBoolean } from "src/common/functions";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    private s3service: S3Service,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, image: Express.Multer.File) {
    const { Location } = await this.s3service.uploadFile(image, "snappfood-image");
    let { parentId, show, slug, title } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException("Category Already Exist");
    if (isBoolean(show)) {
      show = toBoolean(show);
    } 
    if (parentId == ("" as any)) {
      throw new BadRequestException("dont send empty value for parentId");
    }
    await this.categoryRepository.insert({
      parentId,
      title,
      show,
      slug,
      image: Location,
    });
    return {
      message: "Category Created!",
    };
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }
  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
