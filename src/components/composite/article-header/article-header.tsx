import { formatDisplayDate } from "@/utils/date";
import type { ArticleMeta } from "@/theme/contracts";
import { ReadingProgress } from "./reading-progress";
import { ShareButton } from "./share-button";

export function ArticleHeader({ article }: { article: ArticleMeta }) {
  return (
    <header className="flex max-w-3xl flex-col gap-5">
      <ReadingProgress />
      <h1 className="font-heading text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.035em]">
        {article.title}
      </h1>
      <p className="text-lg leading-relaxed">{article.summary}</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          Yizun Yuan · {formatDisplayDate(article.date)} · {article.minutes} min
          read
        </p>
        <ShareButton title={article.title} />
      </div>
    </header>
  );
}
