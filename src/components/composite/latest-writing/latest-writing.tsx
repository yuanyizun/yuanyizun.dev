import Link from "next/link";
import { formatDisplayDate } from "@/utils/date";

type WritingPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export function LatestWriting({ posts }: { posts: WritingPost[] }) {
  const latest = posts.slice(0, 4);

  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-heading text-[clamp(2rem,3vw,2.75rem)] tracking-[-0.03em]">
        Latest writing
      </h2>
      {latest.length === 0 ? (
        <p>No notes published yet.</p>
      ) : (
        <ul className="flex flex-col">
          {latest.map((post) => (
            <li key={post.slug} className="border-t border-border">
              <Link
                href={`/posts/${post.slug}`}
                className="grid gap-2 py-5 no-underline sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8"
              >
                <time
                  dateTime={post.date}
                  className="font-mono text-xs text-muted-foreground"
                >
                  {formatDisplayDate(post.date)}
                </time>
                <span>
                  <span className="block text-lg">{post.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {post.summary}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
