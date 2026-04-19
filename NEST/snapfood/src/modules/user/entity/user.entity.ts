import { EntityNames } from "src/common/enums";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AddressEntity } from "./address.entity";
import { OtpEntity } from "./otp.entity";
import { FeedbackEntity } from "src/modules/menu/entity/feedback.entity";

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;
  @Column({ nullable: true })
  first_name!: string;
  @Column({ nullable: true })
  last_name!: string;
  @Column({ unique: true })
  mobile!: string;
  @Column({ default: false })
  mobile_verified!: boolean;
  @Column({ nullable: true, unique: true })
  email!: string;
  @Column({ unique: true, nullable: true })
  invite_code!: string;
  @Column({ default: 0 })
  score!: number;
  @Column({ nullable: true })
  agentId!: number;
  @Column({ nullable: true })
  otpId!: number;
  @OneToMany(() => AddressEntity, (address) => address.user)
  addressList!: AddressEntity;
  @OneToMany(() => FeedbackEntity, (feedback) => feedback.user)
  feedbacks!: FeedbackEntity[];
  @OneToOne(() => OtpEntity, (otp) => otp.user, { onDelete: "SET NULL" })
  @JoinColumn()
  otp!: OtpEntity;

  @CreateDateColumn()
  created_at!: Date;
  @UpdateDateColumn()
  updated_at!: Date;
}
