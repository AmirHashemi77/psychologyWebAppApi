import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireAdminAuth } from "../middlewares/requireAdminAuth";
import { adminLoginSchema } from "../validators/adminAuth";
import { adminLoginController } from "../controllers/adminAuthController";
import { adminArticleCreateSchema, adminArticleListSchema, adminArticleUpdateSchema, idParamSchema } from "../validators/articles";
import { adminArticleCreateController, adminArticleDeleteController, adminArticleGetController, adminArticleListController, adminArticleStatusUpdateController, adminArticleUpdateController } from "../controllers/adminArticlesController";
import { tagCreateSchema, tagUpdateSchema, tagListSchema } from "../validators/tags";
import { adminTagCreateController, adminTagDeleteController, adminTagListController, adminTagUpdateController } from "../controllers/adminTagsController";

export const adminRouter = Router();

/**
 * @openapi
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdminLoginRequest"
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdminLoginResponse"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.post("/login", validate(adminLoginSchema), adminLoginController);

adminRouter.use(requireAdminAuth);

/**
 * @openapi
 * /api/admin/articles:
 *   get:
 *     summary: List articles (admin)
 *     tags: [Admin Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published] }
 *     responses:
 *       200:
 *         description: Paginated articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginationResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.get("/articles", validate(adminArticleListSchema), adminArticleListController);

/**
 * @openapi
 * /api/admin/articles:
 *   post:
 *     summary: Create article (admin)
 *     tags: [Admin Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ArticleUpsertRequest"
 *     responses:
 *       201:
 *         description: Created article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.post("/articles", validate(adminArticleCreateSchema), adminArticleCreateController);

/**
 * @openapi
 * /api/admin/articles/{id}:
 *   get:
 *     summary: Get article by id (admin)
 *     tags: [Admin Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Article detail (admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdminArticleDetailResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.get("/articles/:id", validate(idParamSchema), adminArticleGetController);

/**
 * @openapi
 * /api/admin/articles/{id}/status:
 *   patch:
 *     summary: Update article status (admin)
 *     tags: [Admin Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Updated article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.patch(
  "/articles/:id/status",
  validate(idParamSchema),
  adminArticleStatusUpdateController,
);

/**
 * @openapi
 * /api/admin/articles/{id}:
 *   put:
 *     summary: Update article (admin)
 *     tags: [Admin Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ArticleUpsertRequest"
 *     responses:
 *       200:
 *         description: Updated article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.put("/articles/:id", validate(adminArticleUpdateSchema), adminArticleUpdateController);

/**
 * @openapi
 * /api/admin/articles/{id}:
 *   delete:
 *     summary: Delete article (admin)
 *     tags: [Admin Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.delete("/articles/:id", validate(idParamSchema), adminArticleDeleteController);

/**
 * @openapi
 * /api/admin/tags:
 *   get:
 *     summary: List tags (admin)
 *     tags: [Admin Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tag list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Tag"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.get("/tags", validate(tagListSchema), adminTagListController);

/**
 * @openapi
 * /api/admin/tags:
 *   post:
 *     summary: Create tag (admin)
 *     tags: [Admin Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TagUpsertRequest"
 *     responses:
 *       201:
 *         description: Created tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Tag"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Conflict (duplicate tag name)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.post("/tags", validate(tagCreateSchema), adminTagCreateController);

/**
 * @openapi
 * /api/admin/tags/{id}:
 *   put:
 *     summary: Update tag (admin)
 *     tags: [Admin Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TagUpsertRequest"
 *     responses:
 *       200:
 *         description: Updated tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Tag"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Conflict (duplicate tag name)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.put("/tags/:id", validate(tagUpdateSchema), adminTagUpdateController);

/**
 * @openapi
 * /api/admin/tags/{id}:
 *   delete:
 *     summary: Delete tag (admin)
 *     tags: [Admin Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
adminRouter.delete("/tags/:id", validate(idParamSchema), adminTagDeleteController);
