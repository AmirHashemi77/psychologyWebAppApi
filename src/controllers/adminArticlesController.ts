import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../services/httpError";
import {
  createArticle,
  deleteArticle,
  listAdminArticles,
  updateArticle,
} from "../services/articleService";
import { toArticleResponse, toPaginationResponse } from "../services/mappers";

export async function adminArticleCreateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const created = await createArticle(req.body);
    res.status(201).json(toArticleResponse(created));
  } catch (err) {
    next(err);
  }
}

export async function adminArticleUpdateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    if (!id) throw new HttpError(400, "Invalid id");
    const updated = await updateArticle(id, req.body);
    res.json(toArticleResponse(updated));
  } catch (err) {
    next(err);
  }
}

export async function adminArticleDeleteController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    if (!id) throw new HttpError(400, "Invalid id");
    await deleteArticle(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function adminArticleListController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const status = (req.query.status as string | undefined) ?? undefined;
    const result = await listAdminArticles({ page, limit, status });
    res.json(toPaginationResponse(result, toArticleResponse));
  } catch (err) {
    next(err);
  }
}

