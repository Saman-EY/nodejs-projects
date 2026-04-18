import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { SupplierGuard } from "src/modules/supplier/guards/supplier.guard";

export function UserAuthGaurd () {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(AuthGuard)
    )
}

export function SupplierAuthGuard () {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(SupplierGuard)
    )
}