import { SetMetadata } from "@nestjs/common";
import { Roles } from "../enums/otherEnums.enum";

export const ROLE_KEY = "ROLES";

export const CanAccess = (...roles: Roles[]) => SetMetadata(ROLE_KEY, roles);
 