import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { FoodDto, UpdateFoodDto } from "../dto/food.dto";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { MenuEntity } from "../entity/menu.entity";
import { DeepPartial, Repository } from "typeorm";
import type { Request } from "express";
import { TypeService } from "./type.service";
import { S3Service } from "src/modules/s3/s3.service";
import { TypeEntity } from "../entity/type.entity";

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(MenuEntity) private menuRepo: Repository<MenuEntity>,
    @InjectRepository(TypeEntity) private typeRepo: Repository<TypeEntity>,
    private typeService: TypeService,
    private s3Service: S3Service,
  ) {}

  // SIDE
  async checkIsExist(id: number) {
    const { id: supplierId } = this.req.user;
    const item = await this.menuRepo.findOneBy({ id, supplierId });
    if (!item) throw new NotFoundException("Not found!");
    return item;
  }

  // MAIN
  async create(foodDto: FoodDto, image: Express.Multer.File) {
    const { id: supplierId } = this.req.user;
    const { name, description, discount, price, typeId } = foodDto;
    const type = await this.typeService.findOneById(+typeId);
    const { Location, Key } = await this.s3Service.uploadFile(image, "menu-item");
    const item = this.menuRepo.create({
      name,
      description,
      discount,
      price,
      typeId: type.id,
      supplierId,
      image: Location,
      key: Key,
    });
    await this.menuRepo.save(item);
    return {
      message: "created",
    };
  }

  async update(id: number, foodDto: UpdateFoodDto, image: Express.Multer.File) {
    const { id: supplierId } = this.req.user;
    const { name, description, discount, price, typeId } = foodDto;
    const menuItem = await this.checkIsExist(id);
    let updatedObject: DeepPartial<MenuEntity> = {};

    if (typeId) {
      const type = await this.typeService.findOneById(+typeId);
      updatedObject.typeId = type.id;
    }
    if (name) updatedObject.name = name;
    if (description) updatedObject.description = description;
    if (discount) updatedObject.discount = discount;
    if (price) updatedObject.price = price;
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(image, "snappfood-image");
      if (Location) {
        updatedObject.image = Location;
        updatedObject.key = Key;
        if (menuItem.key) await this.s3Service.deleteFile(menuItem.key);
      }
    }

    await this.menuRepo.update({ id, supplierId }, updatedObject);
    return {
      message: "Menu Item Updated",
    };
  }

  async findAll(supplierId: number) {
    return await this.typeRepo.find({
      where: { supplierId },
      relations: {
        items: true,
      },
    });
  }

  async findOne(id: number) {
    const { id: supplierId } = this.req.user;

    const item = await this.menuRepo.findOne({
      where: {
        id,
        supplierId,
      },
      relations: {
        type: true,
        feedbacks: {
          user: true,
        },
      },

      select: {
        type: {
          title: true,
        },

        feedbacks: {
          comment: true,
          created_at: true,
          user: {
            first_name: true,
            last_name: true,
          },
          score: true,
        },
      },
    });

    if (!item) throw new NotFoundException("Not found!");
    return item;
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.menuRepo.delete({ id });

    return {
      message: "deleted",
    };
  }
}
