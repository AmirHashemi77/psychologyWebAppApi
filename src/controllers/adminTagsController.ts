import type { Request, Response, NextFunction } from "express";
import { createTag, deleteTag, listTags, updateTag } from "../services/tagService";
import { toAdminTagResponse, toTagResponse } from "../services/mappers";
import { HttpError } from "../services/httpError";

export async function adminTagListController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tags = await listTags();
    res.json(tags.map(toAdminTagResponse));
  } catch (err) {
    next(err);
  }
}

export async function adminTagCreateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const created = await createTag(req.body);
    res.status(201).json(toTagResponse(created));
  } catch (err) {
    next(err);
  }
}

export async function adminTagUpdateController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    if (!id) throw new HttpError(400, "Invalid id");
    const updated = await updateTag(id, req.body);
    res.json(toTagResponse(updated));
  } catch (err) {
    next(err);
  }
}

export async function adminTagDeleteController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;
    if (!id) throw new HttpError(400, "Invalid id");
    await deleteTag(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
