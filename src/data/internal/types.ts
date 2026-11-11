import "server-only";

export type ContentSummary = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type ContentRecord = ContentSummary & {
  content: string;
  archived: boolean;
};
