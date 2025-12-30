import { z } from "zod";

export const idParamSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).passthrough(),
});

const articleBody = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  image: z.string().trim().min(1).nullable(),
  status: z.enum(["draft", "published"]),
  value: z.array(z.unknown()),
  html: z.string().min(1),
  tagIds: z.array(z.string().uuid()),
});

export const adminArticleCreateSchema = z.object({
  body: articleBody,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const adminArticleUpdateSchema = z.object({
  body: articleBody,
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).passthrough(),
});

export const adminArticleListSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({}).passthrough(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(["draft", "published"]).optional(),
  }),
});

export const publicArticleListSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({}).passthrough(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    tags: z.string().optional(),
  }),
});

export const publicArticleGetSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).passthrough(),
});
