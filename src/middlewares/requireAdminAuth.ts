import type { Request, Response, NextFunction } from "express";
import { verifyAdminJwt } from "../services/jwtService";
import { HttpError } from "../services/httpError";

export function requireAdminAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const auth = req.header("authorization");
    if (!auth) throw new HttpError(401, "Unauthorized");

    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) throw new HttpError(401, "Unauthorized");

    try {
      verifyAdminJwt(token);
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(401, "Unauthorized");
    }
    next();
  } catch (err) {
    next(err);
  }
}
