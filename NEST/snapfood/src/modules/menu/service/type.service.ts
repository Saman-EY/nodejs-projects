import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeEntity } from "../entity/type.entity";
import { Repository } from "typeorm";
import { NotFoundError } from "rxjs";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { TypeDto } from "../dto/type.dto";
import { SupplierEntity } from "src/modules/supplier/entity/supplier.entity";

@Injectable({ scope: Scope.REQUEST })
export class TypeService {
  constructor(
    @InjectRepository(TypeEntity) private typeRepo: Repository<TypeEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createDto: { title: string }) {
    const { id: supplierId } = this.req.user as SupplierEntity;
    const type = this.typeRepo.create({ title: createDto.title, supplierId });
    await this.typeRepo.save(type);

    return {
      message: "Created",
    };
  }

  async findAll() {
    const { id: supplierId } = this.req.user as SupplierEntity;
    const [types, count] = await this.typeRepo.findAndCount({
      where: {
        supplierId,
      },
      order: {
        id: "DESC",
      },
    });

    return types;
  }
  async findOneById(id: number) {
    const { id: supplierId } = this.req.user as SupplierEntity;
    const type = await this.typeRepo.findOne({
      where: {
        id,
        supplierId,
      },
      relations: {
        supplier: true,
      },
      select: {
        id: true,
        title: true,
        supplier: {
          id: true,
          manager_name: true,
          phone: true,
        },
      },
    });
    if (!type) throw new NotFoundException("Type Not Found");

    return type;
  }

  async remove(id: number) {
    await this.findOneById(id);

    await this.typeRepo.delete({ id });
    return {
      message: "Type Removed",
    };
  }

  async update(id: number, typeDto: TypeDto) {
    let type = await this.findOneById(id);
    const { title } = typeDto;
    if (title) type.title = title;
    await this.typeRepo.save(type);
    return {
      message: "updated successfuly",
    };
  }
}
