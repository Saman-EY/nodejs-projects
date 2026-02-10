const createHttpError = require("http-errors");
const { Order } = require("./order.model");
const { OrderStatus } = require("../../common/order.const");
const { Payment } = require("../payment/payment.model");

async function getOrdersService(req, res, next) {
  try {
    const { id } = req.user;
    const { status } = req.query;

    if (!status || !Object.values(OrderStatus).includes(status)) throw createHttpError(400, "send correct status");

    const orders = await Order.findAll({
      where: {
        userId: id,
        status,
      },
    });

    res.json({
      orders,
    });
  } catch (error) {
    next(error);
  }
}
async function getSingleOrdersService(req, res, next) {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const orders = await Order.findAll({
      where: {
        userId,
        id,
      },
      attributes: {
        exclude: ["paymentId", "userId"],
      },
      include: [
        {
          model: Payment,
          as: "payment",
          attributes: {
            exclude: ["orderId", "userId"],
          },
        },
      ],
    });

    res.json({
      orders,
    });
  } catch (error) {
    next(error);
  }
}
async function setPackedStatusToOrderService(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "Order Not Found!");

    if (order.status !== OrderStatus.Packed) throw createHttpError(400, "wrong status.");
    order.status = OrderStatus.Packed;
    return res.json({
      message: "status has set to Packed",
    });
  } catch (error) {
    next(error);
  }
}
async function setCancledStatusToOrderService(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "Order Not Found!");

    if ([[OrderStatus.Pending, OrderStatus.Canceled, OrderStatus.Delivered]].includes(order.status)) throw createHttpError(400, "wrong status.");
    order.status = OrderStatus.Canceled ;
    return res.json({
      message: "status has set to canceled",
    });
  } catch (error) {
    next(error);
  }
}
async function setDeliveryStatusToOrderService(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) throw createHttpError(404, "Order Not Found!");

    if (order.status !== OrderStatus.InTransit) throw createHttpError(400, "wrong status.");
    order.status = OrderStatus.Delivered;
    return res.json({
      message: "status has set to Packed",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrdersService,
  getSingleOrdersService,
  setDeliveryStatusToOrderService,
  setCancledStatusToOrderService,
  setPackedStatusToOrderService,
};
