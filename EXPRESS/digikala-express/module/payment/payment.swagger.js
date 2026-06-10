/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment processing
 */

/**
 * @swagger
 * /api/payment:
 *   post:
 *     summary: Initiate payment for basket
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payment initiated, returns Zarinpal redirect URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authority:
 *                   type: string
 *                   example: A00000000000000000000000000217885159
 *                 url:
 *                   type: string
 *                   example: https://payment.zarinpal.com/pg/StartPay/A00000000000000000000000000217885159
 *       400:
 *         description: Basket is empty
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/payment/callback:
 *   get:
 *     summary: Zarinpal payment callback (called by Zarinpal after payment)
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: Status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [OK, NOK]
 *         description: Payment status from Zarinpal
 *       - in: query
 *         name: Authority
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment authority code from Zarinpal
 *     responses:
 *       302:
 *         description: Redirects to frontend with success or failure status
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             examples:
 *               success:
 *                 value: http://someFrontEnd.com/payment?status=success
 *               failure:
 *                 value: http://someFrontEnd.com/payment?status=failure
 *       404:
 *         description: Payment not found
 */

/**
 * @swagger
 * /api/payment/checkout:
 *   get:
 *     summary: Demo checkout (without real payment gateway)
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order Submited!
 *       400:
 *         description: Basket is empty
 *       401:
 *         description: Unauthorized
 */