export function normalizeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function tokenizeQuery(value: string) {
  return normalizeText(value)
    .split(/\s+/)
    .filter(Boolean);
}
