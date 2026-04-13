import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "./entities/transaction.entity";
import { DataSource, Repository } from "typeorm";
import { DepositDto } from "./dto/depositDto";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/entities/user.entity";
import { TransactionTypes } from "src/enums";
import { ProductsData } from "src/products";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity) private transactionRepository: Repository<TransactionEntity>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async deposit(depositDto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // transaction rollback logic (ACID)
    try {
      const { amount, fullname, mobile } = depositDto;
      const user = await this.userService.createUser({ mobile, fullname });
      const userData = await queryRunner.manager.findOneBy(UserEntity, { id: user.id });
      if (!userData) throw new NotFoundException("data not found!");
      const newBalance = userData?.balance + amount;
      await queryRunner.manager.update(UserEntity, { id: user.id }, { balance: newBalance });
      await queryRunner.manager.insert(TransactionEntity, {
        amount,
        type: TransactionTypes.Deposit,
        invoice_number: Date.now().toString(),
        userId: user.id,
      });
      // commit
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        message: "payment successfuly",
      };
    } catch (error) {
      console.log(error);
      // rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
  }

  async paymentByWallet(productId: number, userId: number) {
    const product = ProductsData.find((p) => p.id === productId);
    if (!product) throw new NotFoundException("Product Not Found");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneBy(UserEntity, { id: userId });
      if (!user) throw new NotFoundException("user not found");
      if (product.price > user.balance) {
        throw new BadRequestException("balance is not enough!");
      }

      const newBalance = user.balance - product.price;
      await queryRunner.manager.update(
        UserEntity,
        { id: userId },
        {
          balance: newBalance,
        },
      );

      await queryRunner.manager.insert(TransactionEntity, {
        amount: product.price,
        userId,
        purchasedProductId: productId,
        invoice_number: Date.now().toString(),
        type: TransactionTypes.Withdraw,
      });
      // commit
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        message: "purchase successfuly",
      };
    } catch (error) {
      // rollback
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (error?.statusCode) {
        throw new HttpException(error?.message, error?.statusCode);
      }
      throw new BadRequestException(error?.message);
    }
  }
}
