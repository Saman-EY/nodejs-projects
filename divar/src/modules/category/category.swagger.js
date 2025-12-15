/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Category routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateCategory:
 *              type: object
 *              required:
 *                  - name
 *                  - icon
 *              properties:
 *                  name:
 *                      type: string
 *                  slug:
 *                      type: string
 *                      example: ""
 *                  icon:
 *                      type: string
 *                  parent:
 *                      type: string
 *                      example: ""
 */

/**
 * @swagger
 * /category:
 *  post:
 *      summary: create new category
 *      tags:
 *          - Category
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/CreateCategory"
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/CreateCategory"
 *      responses:
 *          201:
 *              description: created
 */
/**
 * @swagger
 * /category:
 *  get:
 *      summary: get all categories
 *      tags:
 *          - Category
 *      responses:
 *          200:
 *              description: success
 */
/**
 * @swagger
 * /category/{id}:
 *  delete:
 *      summary: delete category by id
 *      tags:
 *          - Category
 *      parameters:
 *          - in: path
 *            name: id
 *      responses:
 *          200:
 *              description: success
 */
