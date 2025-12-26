import { HttpError } from "./httpError";

export function parsePageLimit(input: { page: unknown; limit: unknown }) {
  const page = Number(input.page ?? 1);
  const limit = Number(input.limit ?? 10);

  if (!Number.isFinite(page) || page < 1) throw new HttpError(400, "Invalid page");
  if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
    throw new HttpError(400, "Invalid limit");
  }

  const skip = (page - 1) * limit;
  const take = limit;
  return { page, limit, skip, take };
}

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

