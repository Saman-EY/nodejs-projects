/**
 * @swagger
 * tags:
 *   name: Basket
 *   description: Shopping basket management
 */

/**
 * @swagger
 * /api/basket/add:
 *   post:
 *     summary: Add product to basket
 *     tags: [Basket]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               colorId:
 *                 type: integer
 *                 example: 2
 *                 description: Required if product type is Coloring
 *               sizeId:
 *                 type: integer
 *                 example: 3
 *                 description: Required if product type is Sizing
 *     responses:
 *       200:
 *         description: Added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Added To Cart Successfuly
 *       400:
 *         description: Bad request (out of stock, missing color/size)
 *       404:
 *         description: Product, color or size not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/basket:
 *   get:
 *     summary: Get current user's basket
 *     tags: [Basket]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User basket with calculated amounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAmount:
 *                   type: number
 *                   example: 5000000
 *                 totalDiscount:
 *                   type: number
 *                   example: 500000
 *                 finalAmount:
 *                   type: number
 *                   example: 4500000
 *                 basket:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       price:
 *                         type: number
 *                       finalPrice:
 *                         type: number
 *                       discountAmount:
 *                         type: number
 *                       colors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             code:
 *                               type: string
 *                             price:
 *                               type: number
 *                             discountAmount:
 *                               type: number
 *                             finalPrice:
 *                               type: number
 *                             count:
 *                               type: integer
 *                       sizes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             size:
 *                               type: string
 *                             price:
 *                               type: number
 *                             discountAmount:
 *                               type: number
 *                             finalPrice:
 *                               type: number
 *                             count:
 *                               type: integer
 *       401:
 *         description: Unauthorized
 */