import { TransactionTypes } from "src/enums";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("transaction")
export class TransactionEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ type: "enum", enum: TransactionTypes })
  type: string;
  @Column({ unique: true })
  invoice_number: string;
  @Column()
  userId: number;
  @Column({ type: "numeric" })
  amount: number;
  @Column({ nullable: true })
  purchasedProductId: number;

  @ManyToOne(() => UserEntity, (user) => user.transactions, { onDelete: "SET NULL" })
  user: UserEntity;
  @CreateDateColumn()
  created_at: Date;
}
