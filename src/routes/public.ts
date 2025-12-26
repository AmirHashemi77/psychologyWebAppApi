import { Router } from "express";
import { validate } from "../middlewares/validate";
import {
  publicArticleGetSchema,
  publicArticleListSchema,
} from "../validators/articles";
import {
  publicArticleGetController,
  publicArticleListController,
} from "../controllers/publicArticlesController";
import { publicTagListController } from "../controllers/publicTagsController";

export const publicRouter = Router();

/**
 * @openapi
 * /api/articles:
 *   get:
 *     summary: List published articles
 *     tags: [Public Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: tags
 *         description: Comma-separated tag names (OR logic)
 *         schema: { type: string, example: "tag1,tag2" }
 *     responses:
 *       200:
 *         description: Paginated published articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginationResponse"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
publicRouter.get(
  "/articles",
  validate(publicArticleListSchema),
  publicArticleListController,
);

/**
 * @openapi
 * /api/articles/{id}:
 *   get:
 *     summary: Get a published article by id
 *     tags: [Public Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Published article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Article"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
publicRouter.get(
  "/articles/:id",
  validate(publicArticleGetSchema),
  publicArticleGetController,
);

/**
 * @openapi
 * /api/tags:
 *   get:
 *     summary: List tags
 *     tags: [Public Tags]
 *     responses:
 *       200:
 *         description: Tag list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Tag"
 */
publicRouter.get("/tags", publicTagListController);
