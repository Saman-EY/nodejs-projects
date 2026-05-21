import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntiy } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from 'src/common/enums';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntiy) private orderRepo: Repository<OrderEntiy>,
  ) {}
  //   SIDES
  async findById(orderId: number) {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Order Not Found!');
    return order;
  }

  //   MAINS
  async getAllOrdered() {
    return await this.orderRepo.find({
      where: {
        status: OrderStatus.Ordered,
      },
    });
  }

  async setInProgress(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.Ordered)
      throw new BadRequestException('Order Is Not In Paid Queue');

    order.status = OrderStatus.InProgress;
    await this.orderRepo.save(order);

    return {
      message: 'status has been changed!',
    };
  }

  async setPacked(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.InProgress)
      throw new BadRequestException('Order Is Not In Progress Queue');

    order.status = OrderStatus.Packed;
    await this.orderRepo.save(order);

    return {
      message: 'status has been changed!',
    };
  }

  async setToTransit(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.Packed)
      throw new BadRequestException('Order Is Not In Packed Queue');

    order.status = OrderStatus.InTransit;
    await this.orderRepo.save(order);

    return {
      message: 'status has been changed!',
    };
  }

  async setToDelivary(orderId: number) {
    const order = await this.findById(orderId);
    if (order.status !== OrderStatus.InTransit)
      throw new BadRequestException('Order Is Not In Transit Queue');

    order.status = OrderStatus.Delivered;
    await this.orderRepo.save(order);

    return {
      message: 'status has been changed!',
    };
  }

  async setCanceled(orderId: number) {
    const order = await this.findById(orderId);
    if (
      order.status === OrderStatus.Canceled ||
      order.status === OrderStatus.Pending
    )
      throw new BadRequestException('You Cant Cancel Yet!');

    order.status = OrderStatus.Canceled;
    await this.orderRepo.save(order);

    return {
      message: 'Canceled succesfuly!',
    };
  }
}
