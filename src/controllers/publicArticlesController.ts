import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../services/httpError";
import { getPublishedArticle, listPublishedArticles } from "../services/articleService";
import { toArticleResponse, toPaginationResponse } from "../services/mappers";
import { parseCsvTags } from "../services/tagParsing";

export async function publicArticleListController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const tags = parseCsvTags((req.query.tags as string | undefined) ?? undefined);
    const result = await listPublishedArticles({ page, limit, tags });
    res.json(toPaginationResponse(result, toArticleResponse));
  } catch (err) {
    next(err);
  }
}

export async function publicArticleGetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const article = await getPublishedArticle(req.params.id);
    if (!article) throw new HttpError(404, "Not found");
    res.json(toArticleResponse(article));
  } catch (err) {
    next(err);
  }
}

