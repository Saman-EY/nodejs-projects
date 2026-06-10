/**
 * @swagger
 * tags:
 *   name: RBAC
 *   description: Role-based access control
 */

/**
 * @swagger
 * /api/rbac/role:
 *   post:
 *     summary: Create a new role
 *     tags: [RBAC]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: admin
 *               description:
 *                 type: string
 *                 example: Administrator role with full access
 *     responses:
 *       200:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: role successfuly added
 *       409:
 *         description: Role already exists
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/rbac/permission:
 *   post:
 *     summary: Create a new permission
 *     tags: [RBAC]
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
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: create:product
 *               description:
 *                 type: string
 *                 example: Allows creating products
 *     responses:
 *       200:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: permission successfuly added
 *       409:
 *         description: Permission already exists
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/rbac/add-permission-to-role:
 *   post:
 *     summary: Assign permissions to a role
 *     tags: [RBAC]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 1
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: List of permission IDs to assign
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: permission to role assigned
 *       400:
 *         description: Invalid permissions list
 *       404:
 *         description: Role not found
 *       401:
 *         description: Unauthorized
 */ 