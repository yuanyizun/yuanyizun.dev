import raw from "@/configs/header-ticker.json";

export type HeaderTickerContent = {
  items: string[];
};

function loadHeaderTicker(data: unknown): HeaderTickerContent {
  if (
    typeof data !== "object" ||
    data === null ||
    !("items" in data) ||
    !Array.isArray((data as { items: unknown }).items)
  ) {
    throw new Error('header-ticker.json must define a non-empty "items" string array');
  }

  const items = (data as { items: unknown[] }).items;
  if (
    items.length === 0 ||
    items.some((item) => typeof item !== "string" || item.length === 0)
  ) {
    throw new Error('header-ticker.json "items" must be a non-empty array of non-empty strings');
  }

  return { items: items as string[] };
}

export const HEADER_TICKER = loadHeaderTicker(raw);
