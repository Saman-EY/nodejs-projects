const { Model } = require("sequelize");
const { OrderStatus } = require("../../common/order.const");
const { getUserBasketById } = require("../basket/basket.service");
const { Order, OrderItem } = require("../order/order.model");
const { Payment } = require("./payment.model");
const { zarinpalRequestService, zarinpalVerifyService } = require("../services/zarinpal.service");
const createHttpError = require("http-errors");
const { Basket } = require("../basket/basket.model");

async function paymentBasketService(req, res, next) {
  try {
    const { id: userId } = req.user;
    const { basket, totalAmount, finalAmount, totalDiscount } = await getUserBasketById(userId);

    const payment = await Payment.create({
      userId,
      amount: finalAmount,
      status: false,
    });

    const order = await Order.create({
      userId,
      paymentId: payment.id,
      total_amount: totalAmount,
      final_amount: finalAmount,
      discount_amount: totalDiscount,
      status: OrderStatus.Pending,
      address: "Tehran - Shademan st - Teymoori st",
    });

    payment.orderId = order.id;
    let orderList = [];

    for (const item of basket) {
      let items = [];

      if (item?.sizes?.length > 0) {
        items = item?.sizes.map((size) => {
          return {
            orderId: order.id,
            productId: item?.id,
            sizeId: size?.id,
            count: size?.count,
          };
        });
      } else if (item?.colors?.length > 0) {
        items = item?.colors.map((color) => {
          return {
            orderId: order.id,
            productId: item?.id,
            colorId: color?.id,
            count: color?.count,
          };
        });
      } else {
        items = [
          {
            orderId: order.id,
            productId: item?.id,
            count: item?.count,
          },
        ];
      }

      orderList.push(...items);
    }

    await OrderItem.bulkCreate(orderList);
    const result = await zarinpalRequestService(payment.amount, req.user);
    payment.authority = result?.authority;
    await payment.save();
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

// for zarinpal callback
async function paymentVerifyService(req, res, next) {
  try {
    const { Status, Authority } = req.query;

    // status: OK - NOK
    if (Status === "OK" && Authority) {
      const payment = await Payment.findOne({ where: { authority: Authority } });
      if (!payment) throw createHttpError(404, "payment not found!");
      const result = await zarinpalVerifyService(payment?.amount, Authority);
      if (result) {
        payment.status = true;
        payment.refId = result?.ref_id ?? "3244";
        const order = await Order.findByPk(payment.orderId);
        if (!order) throw createHttpError(404, "order nor found!");
        order.status = OrderStatus.Pending;
        await order.save();
        await payment.save();
        await Basket.destroy({
          where: {
            userId: order.userId,
          },
        });
        return res.redirect("http://someFrontEnd.com/payment?status=success");
      } else {
        await Payment.destroy({
          where: {
            id: payment?.id,
          },
        });
        await Order.destroy({
          where: {
            id: payment?.orderId,
          },
        });
      }
    }

    return res.redirect("http://someFrontEnd.com/payment?status=failure");
  } catch (error) {
    // next(error);
    res.redirect("http://someFrontEnd.com/payment?status=failure");
  }
}

module.exports = {
  paymentBasketService,
  paymentVerifyService,
};
