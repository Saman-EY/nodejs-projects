import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Put('/set-progress')
  setInProgress(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.setInProgress(orderId);
  }

  @Put('/set-packed')
  setPacked(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.setPacked(orderId);
  }

  @Put('/set-transit')
  setToTransit(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.setToTransit(orderId);
  }

  @Put('/set-delivary')
  setToDelivary(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.setToDelivary(orderId);
  }

  @Put('/set-canceled')
  setCanceled(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.setCanceled(orderId);
  }
}
