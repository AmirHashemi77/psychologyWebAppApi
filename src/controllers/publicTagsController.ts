import type { Request, Response, NextFunction } from "express";
import { listTags } from "../services/tagService";
import { toTagResponse } from "../services/mappers";

export async function publicTagListController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tags = await listTags();
    res.json(tags.map(toTagResponse));
  } catch (err) {
    next(err);
  }
}

