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

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepo: Repository<ProfileEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}
  async changeProfile(profileDto: ProfileDto) {
    const { id: userId, profileId } = this.req.user!;

    let profile = await this.profileRepo.findOneBy({ userId });
    const { bio, birthday, gender, linkedin_profile, x_profile, nick_name } = profileDto;

    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (nick_name) profile.nick_name = nick_name;
      if (gender && Object.values(Gender).includes(gender as Gender)) profile.gender = gender;
    } else {
      profile = await this.profileRepo.create({
        bio,
        birthday,
        gender,
        linkedin_profile,
        x_profile,
        nick_name,
        userId,
      });
    }

    profile = await this.profileRepo.save(profile!);

    if (!profileId) await this.userRepo.update({ id: userId }, { profileId: profile.id });
  }
}
