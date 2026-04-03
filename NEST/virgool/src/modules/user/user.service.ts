import { Inject, Injectable, Scope } from "@nestjs/common";
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
import { Gender } from "src/common/enums/otherEnums.enum";
import { TProfileImages } from "src/common/types/types";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepo: Repository<ProfileEntity>,
    @Inject(REQUEST) private req: Request,
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

    console.log(files);
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
  }

  async profile() {
    const { id } = this.req.user!;
    return this.userRepo.findOne({ where: { id }, relations: ["profile"] });
  }
}
