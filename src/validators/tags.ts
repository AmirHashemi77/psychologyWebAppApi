import { z } from "zod";

export const tagListSchema = z.object({
  body: z.unknown().optional(),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const tagCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const tagUpdateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
  }),
  params: z.object({ id: z.string().uuid() }),
  query: z.object({}).passthrough(),
});

