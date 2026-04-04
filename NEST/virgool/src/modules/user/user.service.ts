import { BadRequestException, ConflictException, Inject, Injectable, Scope } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { ProfileDto } from "./dto/profile.dto";
import { isDate } from "class-validator";
import { CookieKeys, Gender } from "src/common/enums/otherEnums.enum";
import { TProfileImages } from "src/common/types/types";
import { AuthMessage, ConflictMessage, NotFoundMessage, PublicMessage } from "src/common/enums/messages.enum";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/tokens.service";
import { OtpEntity } from "./entities/otp.entity";
import { AuthMethod } from "../auth/enums";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepo: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepo: Repository<OtpEntity>,
    @Inject(REQUEST) private req: Request,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}
  async changeProfile(files: TProfileImages, profileDto: ProfileDto) {
    const { id: userId, profileId } = this.req.user!;

    if (files.image_profile?.length > 0) {
      let [image] = files.image_profile;
      profileDto.image_profile = image?.path?.slice(7); // remove public form image address
    }
    if (files.bg_image?.length > 0) {
      let [image] = files.bg_image;
      profileDto.bg_image = image?.path?.slice(7); // remove public form image address
    }

    let profile = await this.profileRepo.findOneBy({ userId });
    const { bio, birthday, gender, linkedin_profile, x_profile, nick_name, image_profile, bg_image } = profileDto;

    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (nick_name) profile.nick_name = nick_name;
      if (gender && Object.values(Gender).includes(gender as Gender)) profile.gender = gender;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_image) profile.bg_image = bg_image;
    } else {
      profile = this.profileRepo.create({
        bio,
        birthday,
        gender,
        linkedin_profile,
        x_profile,
        nick_name,
        userId,
        image_profile,
        bg_image,
      });
    }

    profile = await this.profileRepo.save(profile);

    if (!profileId) await this.userRepo.update({ id: userId }, { profileId: profile.id });

    return {
      message: PublicMessage.Updated,
    };
  }

  async profile() {
    const { id } = this.req.user!;
    return this.userRepo.findOne({ where: { id }, relations: ["profile"] });
  }

  async changeEmail(email: string) {
    const { id } = this.req.user!;

    const user = await this.userRepo.findOneBy({ email });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.Email);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }

    this.userRepo.update(
      { id },
      {
        new_email: email,
      },
    );
    const otp = await this.authService.saveOtp(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });

    return {
      code: otp.code,
      token,
    };
  }

  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.req.user!;
    const token = this.req.cookies?.[CookieKeys.EmailOtp];

    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);

    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== new_email) throw new BadRequestException(AuthMessage.SomethingWrong);
    const otp = await this.checkOtp(userId, code);

    if (otp.method !== AuthMethod.Email) throw new BadRequestException(AuthMessage.SomethingWrong);

    await this.userRepo.update(
      { id: userId },
      {
        email,
        verified_email: true,
        new_email: null,
      },
    );

    return {
      message: PublicMessage.Updated,
    };
  }

  async changePhone(phone: string) {
    const { id } = this.req.user!;

    const user = await this.userRepo.findOneBy({ phone });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.Phone);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }

    this.userRepo.update(
      { id },
      {
        new_phone: phone,
      },
    );
    const otp = await this.authService.saveOtp(id, AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });

    return {
      code: otp.code,
      token,
    };
  }

  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.req.user!;
    const token = this.req.cookies?.[CookieKeys.PhoneOtp];

    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);

    const { phone } = this.tokenService.verifyPhoneToken(token);
    if (phone !== new_phone) throw new BadRequestException(AuthMessage.SomethingWrong);
    const otp = await this.checkOtp(userId, code);

    if (otp.method !== AuthMethod.Phone) throw new BadRequestException(AuthMessage.SomethingWrong);

    await this.userRepo.update(
      { id: userId },
      {
        phone,
        verified_phone: true,
        new_phone: null,
      },
    );

    return {
      message: PublicMessage.Updated,
    };
  }

  async changeUsername(username: string) {
    const { id } = this.req.user!;

    const user = await this.userRepo.findOneBy({ username });
    if (user && user.id !== id) {
      throw new ConflictException(ConflictMessage.Username);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated,
      };
    }

    await this.userRepo.update(
      { id },
      {
        username,
      },
    );

    return {
      message: PublicMessage.Updated,
    };
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepo.findOneBy({ userId });

    if (!otp) throw new BadRequestException(NotFoundMessage.NotFound);

    const now = new Date();
    if (otp.expiresIn < now) throw new BadRequestException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);
    await this.otpRepo.delete(otp.id);

    return otp;
  }
}
