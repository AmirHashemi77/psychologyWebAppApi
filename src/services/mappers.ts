import type { Article, Tag } from "@prisma/client";
import type { Paginated } from "./pagination";

type ArticleWithTags = Article & { tags: { name: string }[] };

export type ArticleResponseStatus = "draft" | "published";

export type ArticleResponse = {
  id: string;
  title: string;
  summary: string;
  image: string | null;
  status: ArticleResponseStatus;
  tags: string[];
  value: unknown[];
  html: string;
  createdAt: string;
  updatedAt: string;
};

export type TagResponse = {
  id: string;
  name: string;
  createdAt: string;
};

export function toTagResponse(tag: Tag): TagResponse {
  return {
    id: tag.id,
    name: tag.name,
    createdAt: tag.createdAt.toISOString(),
  };
}

export function toArticleResponse(article: ArticleWithTags): ArticleResponse {
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    image: article.image ?? null,
    status: article.status as ArticleResponseStatus,
    tags: article.tags.map((t) => t.name),
    value: (article.value as unknown[]) ?? [],
    html: article.html,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  };
}

export function toPaginationResponse<TItem, TOut>(
  paginated: Paginated<TItem>,
  mapItem: (item: TItem) => TOut,
) {
  return {
    items: paginated.items.map(mapItem),
    page: paginated.page,
    limit: paginated.limit,
    totalItems: paginated.totalItems,
    totalPages: paginated.totalPages,
  };
}

