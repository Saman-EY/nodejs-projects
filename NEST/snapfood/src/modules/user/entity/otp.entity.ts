import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityNames } from "src/common/enums";

@Entity(EntityNames.UserOtp)
export class OtpEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column()
  code!: number;
  @Column()
  expires_in!: Date;
  @Column()
  userId!: number;
  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: "CASCADE" })
  user!: UserEntity;
}
