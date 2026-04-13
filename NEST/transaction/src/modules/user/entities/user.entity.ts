import { TransactionEntity } from "src/modules/transaction/entities/transaction.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  fullname: string;
  @Column()
  mobile: string;
  @Column({ type: "numeric", default: 0 })
  balance: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];

  @CreateDateColumn()
  created_at: Date;
}
