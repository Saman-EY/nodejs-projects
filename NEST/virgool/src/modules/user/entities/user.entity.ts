import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/enities/blog.entity";
import { BlogLikeEntity } from "src/modules/blog/enities/like.entity";
import { BlogBookmarkEntity } from "src/modules/blog/enities/bookmark.entity";

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ nullable: true })
  password: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ type: "varchar", nullable: true })
  new_email: string | null;
  @Column({ type: "varchar", nullable: true })
  new_phone: string | null;
  @Column({ nullable: true, default: false })
  verified_email: boolean;
  @Column({ nullable: true, default: false })
  verified_phone: boolean;
  @Column({ nullable: true })
  otpId: number;
  @Column({ nullable: true })
  profileId: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "otpId" })
  otp: OtpEntity;
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: ProfileEntity;
  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];
  @OneToMany(() => BlogLikeEntity, (like) => like.user)
  likes: BlogLikeEntity[];
  @OneToMany(() => BlogLikeEntity, (bookmark) => bookmark.user)
  bookmarks: BlogBookmarkEntity[];
}
