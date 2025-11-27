/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
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
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP code for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: "#/components/schemas/SendOTP"
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SendOTP"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
/**
 * @swagger
 * /auth/check-otp:
 *   post:
 *     summary: check OTP code for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: "#/components/schemas/CheckOTP"
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CheckOTP"
 *     responses:
 *       200:
 *         description: login successfuly
 */
