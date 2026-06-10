/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nike Shoes
 *               description:
 *                 type: string
 *                 example: A great pair of shoes
 *               type:
 *                 type: string
 *                 enum: [Single, Coloring, Sizing]
 *                 example: Coloring
 *               price:
 *                 type: number
 *                 example: 500000
 *               count:
 *                 type: integer
 *                 example: 10
 *               discount:
 *                 type: integer
 *                 example: 10
 *               active_discount:
 *                 type: boolean
 *                 example: true
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       example: material
 *                     value:
 *                       type: string
 *                       example: leather
 *               colors:
 *                 type: array
 *                 description: Required if type is Coloring
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Red
 *                     code:
 *                       type: string
 *                       example: "#FF0000"
 *                     price:
 *                       type: number
 *                       example: 500000
 *                     count:
 *                       type: integer
 *                       example: 5
 *                     discount:
 *                       type: integer
 *                       example: 10
 *                     active_discount:
 *                       type: boolean
 *                       example: true
 *               sizes:
 *                 type: array
 *                 description: Required if type is Sizing
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                       example: XL
 *                     price:
 *                       type: number
 *                       example: 500000
 *                     count:
 *                       type: integer
 *                       example: 5
 *                     discount:
 *                       type: integer
 *                       example: 10
 *                     active_discount:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product created successfully
 *       400:
 *         description: Invalid product type
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       price:
 *                         type: number
 *                       type:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       discount:
 *                         type: integer
 *                       active_discount:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get single product with details, colors and sizes
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     price:
 *                       type: number
 *                     type:
 *                       type: string
 *                     count:
 *                       type: integer
 *                     description:
 *                       type: string
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                           value:
 *                             type: string
 *                     colors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           price:
 *                             type: number
 *                           count:
 *                             type: integer
 *                     sizes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           size:
 *                             type: string
 *                           price:
 *                             type: number
 *                           count:
 *                             type: integer
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product removed successfuly
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */