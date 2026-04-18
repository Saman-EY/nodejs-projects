import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeEntity } from "../entity/type.entity";
import { Repository } from "typeorm";
import { NotFoundError } from "rxjs";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class TypeService {
  constructor(
    @InjectRepository(TypeEntity) private typeRepo: Repository<TypeEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createDto: { title: string }) {
    const type = this.typeRepo.create({ title: createDto.title });
    await this.typeRepo.save(type);

    return {
      message: "Created",
    };
  }

  async findAll(createDto: { title: string }) {
    return await this.typeRepo.findAndCount({
      where: {},
      order: {
        id: "DESC",
      },
    });
  }
  async findOneById(id: number) {
    const type = this.typeRepo.findOneBy({ id });
    if (!type) throw new NotFoundException("Type Not Found");

    return {
      type,
    };
  }

  async remove(id: number) {
    await this.findOneById(id);

    await this.typeRepo.delete({ id });
    return {
      message: "Type Removed",
    };
  }
}
