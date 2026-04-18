import { SupplierEntity } from "src/modules/supplier/entity/supplier.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

declare global {
  namespace Express {
    interface Request {
      user: UserEntity | SupplierEntity;
    }
  }
}
