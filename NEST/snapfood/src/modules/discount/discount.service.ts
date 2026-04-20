import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

import { DiscountEntity } from "./entity/dicount.entity";
import { DiscountDto } from "./dto/discount.dto";

@Injectable()
export class DiscountService {
  constructor(@InjectRepository(DiscountEntity) private discountRepo: Repository<DiscountEntity>) {}

  // SIDE

  async checkExistCode(code: string) {
    const item = await this.discountRepo.findOneBy({ code });
    if (item) throw new ConflictException("Duplicated Discount!");
  }
  async findOneByCode(code: string) {
    const item = await this.discountRepo.findOneBy({ code });
    if (!item) throw new NotFoundException("discount with this code not found!");
    return item;
  }

  // MAIN
  async create(discountDto: DiscountDto) {
    const { amount, code, expires_in, limit, percent } = discountDto;
    await this.checkExistCode(code);
    const discountObject: DeepPartial<DiscountEntity> = { code };

    if ((!amount && !percent) || (amount && percent)) {
      throw new BadRequestException("You must enter on of the amount or percent field at the same time");
    }

    if (amount && !isNaN(parseFloat(amount.toString()))) {
      discountObject.amount = amount;
    } else if (percent && !isNaN(parseFloat(percent.toString()))) {
      discountObject.percent = percent;
    }

    if (expires_in && !isNaN(parseFloat(expires_in.toString()))) {
      const time = 1000 * 60 * 60 * 24 * expires_in; // example : set 1 day or 2 day or ....
      discountObject.expires_in = new Date(new Date().getTime() + time);
    }
    if (limit && !isNaN(parseFloat(limit.toString()))) {
      discountObject.limit = limit;
    }

    await this.discountRepo.insert(discountObject);

    return {
      message: "Created",
    };
  }

  async findAll() {
    return await this.discountRepo.find({});
  }

  async remove(id: number) {
    const discount = await this.discountRepo.findOneBy({ id });
    if (!discount) throw new NotFoundException("Discount Not Found!");
    await this.discountRepo.delete({ id });
    return {
      message: "Discount Removed",
    };
  }
}
