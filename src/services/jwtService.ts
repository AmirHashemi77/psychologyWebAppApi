import jwt from "jsonwebtoken";
import { HttpError } from "./httpError";

type AdminJwtPayload = { adminId: string };

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new HttpError(500, "JWT secret not configured");
  return secret;
}

export function signAdminJwt(payload: AdminJwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminJwt(token: string) {
  return jwt.verify(token, getJwtSecret()) as AdminJwtPayload;
}

