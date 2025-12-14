/**
 * @swagger
 * tags:
 *   - name: Option
 *     description: Option Module and Routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOption:
 *       type: object
 *       required:
 *         - title
 *         - key
 *         - type
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: Human-readable name of the option
 *         key:
 *           type: string
 *           description: Unique key to identify the option
 *         guide:
 *           type: string
 *           nullable: true
 *           description: Optional guide text for helping users
 *         category:
 *           type: string
 *           description: ObjectId of the related category
 *         type:
 *           type: string
 *           enum: ["number", "string", "array", "boolean"]
 *           description: The data type of the option value
 *         enum:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         title: Color
 *         key: color
 *         type: string
 *         guide: HEX format
 *         category: 671a83fbf1c7227d1a53f8e1
 */

/**
 * @swagger
 * /option:
 *   post:
 *     summary: Create new option for a category
 *     tags: [Option]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: "#/components/schemas/CreateOption"
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateOption"
 *     responses:
 *       200:
 *         description: success
 */

/**
 * @swagger
 * /option/by-category/{categoryId}:
 *   get:
 *     summary: get option by cat id
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           description: Category ObjectId
 *     responses:
 *       200:
 *         description: success
 */
/**
 * @swagger
 * /option/by-category-slug/{slug}:
 *   get:
 *     summary: get option by category slug
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           description: Category ObjectId
 *     responses:
 *       200:
 *         description: success
 */

/**
 * @swagger
 * /option/{id}:
 *   get:
 *     summary: Get option by id
 *     tags: [Option]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Category ObjectId
 *     responses:
 *       200:
 *         description: success
 */
/**
 * @swagger
 * /option:
 *   get:
 *     summary: get all options
 *     tags: [Option]
 *
 *     responses:
 *       200:
 *         description: success
 */
