const createHttpError = require("http-errors");
const { Order } = require("./order.model");
const { OrderStatus } = require("../../common/order.const");

async function getOrderService(req, res, next) {
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

module.exports = {
    getOrderService
}