export function parseCsvTags(tags: string | undefined) {
  if (!tags) return undefined;
  const names = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return names.length ? names : undefined;
}

