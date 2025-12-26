import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return admin;
}

export async function ensureDevAdminSeeded(): Promise<
  | {
      email: string;
      password: string;
      action: "created" | "exists" | "updated";
    }
  | null
> {
  if (process.env.NODE_ENV === "production") return null;

  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "password";

  const existingAdmins = await prisma.admin.findMany({
    orderBy: { email: "asc" },
  });

  if (existingAdmins.length === 0) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({ data: { email, passwordHash } });
    return { email, password, action: "created" };
  }

  const primary = existingAdmins[0];

  if (existingAdmins.length > 1) {
    await prisma.admin.deleteMany({
      where: { id: { in: existingAdmins.slice(1).map((a) => a.id) } },
    });
  }

  const passwordMatches = await bcrypt.compare(password, primary.passwordHash);
  if (primary.email !== email || !passwordMatches) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.update({
      where: { id: primary.id },
      data: { email, passwordHash },
    });
    return { email, password, action: "updated" };
  }

  return { email, password, action: "exists" };
}
