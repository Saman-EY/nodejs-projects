import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
  ) {}

  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOne({ where: { mobile } });
    if (!user) {
      user = this.userRepository.create({ mobile });
      user = await this.userRepository.save(user);
    }
    await this.createOtpForUser(user);
    return {
      message: "Code Send Successfuly",
    };
  }

  async createOtpForUser(user: UserEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2); // 2 min
    const code = randomInt(10000, 99999);

    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("code is not expired yet");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({ code, expires_in: expiresIn, userId: user.id });
    }

    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    user = await this.userRepository.save(user);
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { mobile, code } = otpDto;

    const now = new Date();
    let user = await this.userRepository.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });
    // validattion
    if (!user || !user.otp) throw new UnauthorizedException("Account Not Found!");
    if (user?.otp?.code !== code) throw new UnauthorizedException("Otp Code Is Incorrect");
    if (user?.otp?.expires_in < now) throw new UnauthorizedException("Otp Code Has Expired");

    if (user?.mobileVerified) await this.userRepository.update({ id: user.id }, { mobileVerified: true });


    return {
      message: "Login Success",
    };
  }
}
