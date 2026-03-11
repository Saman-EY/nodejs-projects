/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User Module and Routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SendOTP:
 *       type: object
 *       required:
 *         - mobile
 *       properties:
 *         mobile:
 *           type: string
 *           example: "09120000000"
 *     CheckOTP:
 *       type: object
 *       required:
 *         - mobile
 *         - code
 *       properties:
 *         mobile:
 *           type: string
 *           example: "09120000000"
 *         code:
 *           type: string
 *           example: "12345"
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: get user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: succes
 */
