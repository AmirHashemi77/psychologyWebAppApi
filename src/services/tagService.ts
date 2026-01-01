import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { HttpError } from "./httpError";

export async function listTags() {
  return prisma.tag.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { articles: true } } },
  });
}

export async function createTag(input: { name: string }) {
  try {
    return await prisma.tag.create({ data: { name: input.name } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new HttpError(409, "Conflict");
    }
    throw err;
  }
}

export async function updateTag(id: string, input: { name: string }) {
  try {
    return await prisma.tag.update({ where: { id }, data: { name: input.name } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new HttpError(409, "Conflict");
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new HttpError(404, "Not found");
    }
    throw err;
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new HttpError(404, "Not found");
    }
    throw err;
  }
}
