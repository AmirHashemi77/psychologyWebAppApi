import { ArticleStatus, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { HttpError } from "./httpError";
import { parsePageLimit, type Paginated } from "./pagination";

type ArticleInput = {
  title: string;
  summary: string;
  image: string | null;
  status: "draft" | "published";
  value: unknown[];
  html: string;
  tagIds: string[];
};

const articleInclude = Prisma.validator<Prisma.ArticleInclude>()({
  tags: { select: { name: true } },
});

type ArticleWithTags = Prisma.ArticleGetPayload<{ include: typeof articleInclude }>;

const adminArticleInclude = Prisma.validator<Prisma.ArticleInclude>()({
  tags: { select: { id: true, name: true } },
});

type AdminArticleWithTags = Prisma.ArticleGetPayload<{
  include: typeof adminArticleInclude;
}>;

async function ensureTagsExist(tagIds: string[]) {
  if (tagIds.length === 0) return;
  const tags = await prisma.tag.findMany({ where: { id: { in: tagIds } }, select: { id: true } });
  if (tags.length !== tagIds.length) throw new HttpError(404, "Tag not found");
}

export async function createArticle(input: ArticleInput): Promise<ArticleWithTags> {
  await ensureTagsExist(input.tagIds);
  return prisma.article.create({
    data: {
      title: input.title,
      summary: input.summary,
      image: input.image ?? undefined,
      status: input.status,
      value: input.value as Prisma.InputJsonValue,
      html: input.html,
      tags: { connect: input.tagIds.map((id) => ({ id })) },
    },
    include: articleInclude,
  });
}

export async function updateArticle(id: string, input: ArticleInput): Promise<ArticleWithTags> {
  await ensureTagsExist(input.tagIds);

  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new HttpError(404, "Not found");

  return prisma.article.update({
    where: { id },
    data: {
      title: input.title,
      summary: input.summary,
      image: input.image ?? undefined,
      status: input.status,
      value: input.value as Prisma.InputJsonValue,
      html: input.html,
      tags: { set: input.tagIds.map((tagId) => ({ id: tagId })) },
    },
    include: articleInclude,
  });
}

export async function deleteArticle(id: string) {
  const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new HttpError(404, "Not found");
  await prisma.article.delete({ where: { id } });
}

export async function listAdminArticles(input: {
  page: unknown;
  limit: unknown;
  status?: string;
}): Promise<Paginated<ArticleWithTags>> {
  const { page, limit, skip, take } = parsePageLimit(input);

  const status =
    input.status === "draft"
      ? ArticleStatus.draft
      : input.status === "published"
        ? ArticleStatus.published
        : undefined;

  const where: Prisma.ArticleWhereInput = status ? { status } : {};

  const [totalItems, items] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: articleInclude,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  return { items, page, limit, totalItems, totalPages };
}

export async function listPublishedArticles(input: {
  page: unknown;
  limit: unknown;
  tags?: string[];
}): Promise<Paginated<ArticleWithTags>> {
  const { page, limit, skip, take } = parsePageLimit(input);

  const where: Prisma.ArticleWhereInput = {
    status: ArticleStatus.published,
    ...(input.tags?.length ? { tags: { some: { name: { in: input.tags } } } } : {}),
  };

  const [totalItems, items] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: articleInclude,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  return { items, page, limit, totalItems, totalPages };
}

export async function getPublishedArticle(id: string): Promise<ArticleWithTags | null> {
  return prisma.article.findFirst({
    where: { id, status: ArticleStatus.published },
    include: articleInclude,
  });
}

export async function getAdminArticle(id: string): Promise<AdminArticleWithTags> {
  const article = await prisma.article.findUnique({
    where: { id },
    include: adminArticleInclude,
  });
  if (!article) throw new HttpError(404, "Not found");
  return article;
}

export async function updateArticleStatus(id: string): Promise<ArticleWithTags> {
  const existing = await prisma.article.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!existing) throw new HttpError(404, "Not found");

  const nextStatus =
    existing.status === ArticleStatus.draft ? ArticleStatus.published : ArticleStatus.draft;

  return prisma.article.update({
    where: { id },
    data: { status: nextStatus },
    include: articleInclude,
  });
}
