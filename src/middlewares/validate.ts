import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) return next(result.error);

    req.body = result.data.body;
    req.params = result.data.params as any;
    req.query = result.data.query as any;
    next();
  };
}
