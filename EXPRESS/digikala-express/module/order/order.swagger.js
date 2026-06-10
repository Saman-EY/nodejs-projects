/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders by status
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Pending, Packed, InTransit, Delivered, Canceled]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       address:
 *                         type: string
 *                       total_amount:
 *                         type: number
 *                       final_amount:
 *                         type: number
 *                       discount_amount:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid or missing status
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order with payment details
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details with payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       address:
 *                         type: string
 *                       total_amount:
 *                         type: number
 *                       final_amount:
 *                         type: number
 *                       discount_amount:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       payment:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           status:
 *                             type: boolean
 *                           amount:
 *                             type: number
 *                           refId:
 *                             type: string
 *                           authority:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/set-packed/{id}:
 *   get:
 *     summary: Set order status to Packed
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Status updated to Packed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: status has set to Packed
 *       400:
 *         description: Wrong status transition
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/set-cancel/{id}:
 *   get:
 *     summary: Set order status to Canceled
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Status updated to Canceled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: status has set to canceled
 *       400:
 *         description: Wrong status transition
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders/set-delivered/{id}:
 *   get:
 *     summary: Set order status to Delivered
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Status updated to Delivered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: status has set to Delivered
 *       400:
 *         description: Wrong status transition
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */