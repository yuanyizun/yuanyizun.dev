import { formatDisplayDate } from "@/utils/date";
import { ReadingProgress } from "./reading-progress";
import { ShareRail } from "./share-button";

export type ArticleMeta = {
  title: string;
  date: string;
  summary: string;
  minutes: number;
};

export function ArticleHeader({ article }: { article: ArticleMeta }) {
  return (
    <header className="flex max-w-3xl flex-col gap-5">
      <ReadingProgress />
      <h1 className="font-heading text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.035em]">
        {article.title}
      </h1>
      <p className="text-lg leading-relaxed">{article.summary}</p>
      <p className="font-mono text-xs text-muted-foreground">
        Yizun Yuan · {formatDisplayDate(article.date)} · {article.minutes} min
        read
      </p>
      <ShareRail title={article.title} />
    </header>
  );
}
