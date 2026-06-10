/**
 * @swagger
 * tags:
 *   - name: Post
 *     description: Post Module and Routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePost:
 *       type: object
 *       required:
 *         - title_post
 *         - description
 *         - lat
 *         - lng
 *         - categroy
 *         - amount
 *       properties:
 *         title_post:
 *           type: string
 *           description: Title of the post
 *         description:
 *           type: string
 *           description: Main content / body of the post
 *         lat:
 *           type: number
 *           format: float
 *           description: Latitude coordinate (used for reverse geocoding)
 *         lng:
 *           type: number
 *           format: float
 *           description: Longitude coordinate (used for reverse geocoding)
 *         categroy:
 *           type: string
 *           description: ObjectId of the related category
 *         amount:
 *           type: number
 *           description: Price or amount for the post
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Up to 10 image files
 *       example:
 *         title_post: Cozy apartment in Tehran
 *         description: A nice 2-bedroom apartment near the metro.
 *         lat: 35.6892
 *         lng: 51.3890
 *         categroy: 64a1f2e3b2c4d5e6f7a8b9c0
 *         amount: 5000000
 *
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         userId:
 *           type: string
 *         content:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *           description: ObjectId of the related category
 *         province:
 *           type: string
 *         city:
 *           type: string
 *         district:
 *           type: string
 *         address:
 *           type: string
 *         coordinate:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 2
 *           maxItems: 2
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         options:
 *           type: object
 *           additionalProperties: true
 *           description: Dynamic category-specific key-value pairs
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 64a1f2e3b2c4d5e6f7a8b9c0
 *         title: Cozy apartment in Tehran
 *         userId: 64a1f2e3b2c4d5e6f7a8b9d1
 *         content: A nice 2-bedroom apartment near the metro.
 *         amount: 5000000
 *         category: 64a1f2e3b2c4d5e6f7a8b9e2
 *         province: Tehran
 *         city: Tehran
 *         district: District 3
 *         address: Valiasr St, Tehran
 *         coordinate: [35.6892, 51.3890]
 *         images: ["/uploads/photo1.jpg"]
 *         options: { "متراژ": "80", "تعداد اتاق": "2" }
 *         createdAt: 2024-01-01T00:00:00.000Z
 *         updatedAt: 2024-01-01T00:00:00.000Z
 *
 *     PostDetail:
 *       allOf:
 *         - $ref: "#/components/schemas/Post"
 *         - type: object
 *           properties:
 *             userMobile:
 *               type: string
 *               description: Mobile number of the post owner (joined from users collection)
 *           example:
 *             userMobile: "09121234567"
 */

/**
 * @swagger
 * /post/create:
 *   get:
 *     summary: Get create-post page data
 *     description: >
 *       Returns categories needed to render the create-post form.
 *       If a slug query param is provided, returns sub-categories and
 *       dynamic field options for that category.
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: slug
 *         required: false
 *         schema:
 *           type: string
 *         description: Category slug to load sub-categories and options for
 *     responses:
 *       200:
 *         description: success
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Create a new post
 *     description: >
 *       Creates a new post with multipart form-data. Lat/lng are reverse-geocoded
 *       to fill address fields. Any extra form fields beyond the known keys are
 *       stored as dynamic category options.
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/CreatePost"
 *     responses:
 *       302:
 *         description: Post created — redirects to /post/my
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /post/my:
 *   get:
 *     summary: Get all posts of the authenticated user
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Post"
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /post/delete/{id}:
 *   get:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId of the post to delete
 *     responses:
 *       302:
 *         description: Post deleted — redirects to /post/my
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     description: >
 *       Returns full post details. Joins the owner's mobile number
 *       from the users collection. No authentication required.
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId of the post
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PostDetail"
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Post not found
 */