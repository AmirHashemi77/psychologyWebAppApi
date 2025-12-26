import type { Request, Response, NextFunction } from "express";
import { verifyAdminCredentials } from "../services/adminService";
import { signAdminJwt } from "../services/jwtService";
import { HttpError } from "../services/httpError";

export async function adminLoginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const admin = await verifyAdminCredentials(email, password);
    if (!admin) throw new HttpError(401, "Unauthorized");

    const token = signAdminJwt({ adminId: admin.id });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

