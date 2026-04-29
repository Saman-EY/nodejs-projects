import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto, SupplementaryInfoDto, SupplierDto } from "./dto/supplier.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SupplierEntity } from "./entity/supplier.entity";
import { Repository } from "typeorm";
import { CategoryService } from "../category/category.service";
import { SupplierOtpEntity } from "./entity/otp.entity";
import { randomInt } from "crypto";
import { CheckOtpDto } from "../auth/dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { SupplierStatus } from "src/common/enums";
import { DocumentType } from "src/common/types";
import { S3Service } from "../s3/s3.service";

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity) private supplierRepo: Repository<SupplierEntity>,
    @InjectRepository(SupplierOtpEntity) private supplierOtpRepo: Repository<SupplierOtpEntity>,
    @Inject(REQUEST) private req: Request,
    private categoryService: CategoryService,
    private jwtService: JwtService,
    private s3service: S3Service,
  ) {}

  async signup(supplierDto: SupplierDto) {
    const { categoryId, city, store_name, manager_family, manager_name, invite_code, phone } = supplierDto;

    const supplier = await this.supplierRepo.findOneBy({ phone });
    if (supplier) throw new ConflictException("account already exist!");

    const category = await this.categoryService.findOneById(categoryId);
    let agent: any = null;
    if (invite_code) {
      agent = await this.supplierRepo.findOneBy({ invite_code });
    }

    const mobileNumber = parseInt(phone); // for creating unique invite code

    const account = this.supplierRepo.create({
      manager_family,
      manager_name,
      city,
      agentId: agent?.id ?? null,
      categoryId: category.id,
      store_name,
      phone,
      invite_code: mobileNumber.toString(32).toUpperCase(),
    });

    await this.supplierRepo.save(account);
    const code = await this.createOtpForSupplier(account);
    return {
      code,
      message: "otp code send successfuly",
    };
  }
  async login(loginDto: LoginDto) {
    const { phone } = loginDto;

    const supplier = await this.supplierRepo.findOneBy({ phone });
    if (!supplier) throw new NotFoundException("Account Not Found!");

    const code = await this.createOtpForSupplier(supplier);
    return {
      code,
      message: "otp code send successfuly",
    };
  }

  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2); // 2 min
    const code = randomInt(10000, 99999);

    let otp = await this.supplierOtpRepo.findOneBy({ supplierId: supplier.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("code is not expired yet");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOtpRepo.create({ code, expires_in: expiresIn, supplierId: supplier.id });
    }

    otp = await this.supplierOtpRepo.save(otp);
    supplier.otpId = otp.id;
    supplier = await this.supplierRepo.save(supplier);
    return code;
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { mobile, code } = otpDto;

    const now = new Date();
    let supplier = await this.supplierRepo.findOne({
      where: { phone: mobile },
      relations: {
        supplier_otp: true,
      },
    });
    // validattion
    if (!supplier) throw new UnauthorizedException("Account Not Found!");
    if (!supplier.supplier_otp) throw new UnauthorizedException("Try Login Again");
    if (supplier?.supplier_otp?.code !== code) throw new UnauthorizedException("Otp Code Is Incorrect");
    if (supplier?.supplier_otp?.expires_in < now) throw new UnauthorizedException("Otp Code Has Expired");

    if (supplier?.mobile_verified) await this.supplierRepo.update({ id: supplier.id }, { mobile_verified: true });
    const payload = { id: supplier?.id };

    const { accessToken, refreshToken } = this.createTokens(payload);

    await this.supplierOtpRepo.delete({ supplierId: supplier.id });

    return {
      accessToken,
      refreshToken,
      message: "Login Success",
    };
  }

  createTokens(payload: { id: number }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify<{ id: number }>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      if (typeof payload === "object" && payload?.id) {
        const supplier = await this.supplierRepo.findOneBy({ id: payload.id });
        if (!supplier) throw new UnauthorizedException("Login To Your Account!");
        return {
          id: supplier.id,
          first_name: supplier.manager_name,
          last_name: supplier.manager_family,
          phone: supplier.phone,
        };
      }

      throw new UnauthorizedException("Login To Your Account!");
    } catch (error) {
      throw new UnauthorizedException("Login To Your Account!");
    }
  }

  async saveSupplementaryInfo(infoDto: SupplementaryInfoDto) {
    const { id } = this.req.user;
    const { email, national_code } = infoDto;

    let supplier = await this.supplierRepo.findOneBy({ national_code });
    if (supplier && supplier.id !== id) {
      throw new ConflictException("national code already used");
    }

    supplier = await this.supplierRepo.findOneBy({ email });
    if (supplier && supplier.email !== email) {
      throw new ConflictException("email already used");
    }

    await this.supplierRepo.update(
      { id },
      {
        email,
        national_code,
        status: SupplierStatus.SuplementaryInfo,
      },
    );

    return {
      message: "information updated!",
    };
  }

  async uploadDocuments(files: DocumentType) {
    const { id } = this.req.user;
    const { acceptedDoc, image } = files;
    const supplier = await this.supplierRepo.findOneBy({ id });
    const imageResult = await this.s3service.uploadFile(image[0], "images");
    const docResult = await this.s3service.uploadFile(acceptedDoc[0], "acceptedDoc");

    if (imageResult) supplier!.image = imageResult.Location;
    if (docResult) supplier!.document = docResult.Location;

    supplier!.status = SupplierStatus.UploadedDoc;
    await this.supplierRepo.save(supplier!);
    return {
      message: "document uploaded",
    };
  }

  async getAllStore() {
    return await this.supplierRepo.find({
      relations: {
        category: true,
      },
      select: {
        id: true,
        manager_family: true,
        manager_name: true,
        store_name: true,
        city: true,
        image: true,
        document: true,
        category: {
          id: true,
          title: true,
          slug: true,
          image: true,
          imageKey: true,
        },
      },
    });
  }
}
