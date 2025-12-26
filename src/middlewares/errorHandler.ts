import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { HttpError } from "../services/httpError";

function sendError(res: Response, status: number, message: string) {
  res.status(status).json({ error: { message } });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return sendError(res, 400, err.issues.map((i) => i.message).join(", "));
  }

  if (err instanceof HttpError) {
    return sendError(res, err.status, err.message);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") return sendError(res, 404, "Not found");
    if (err.code === "P2002") return sendError(res, 409, "Conflict");
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return sendError(res, 500, "Internal server error");
}

