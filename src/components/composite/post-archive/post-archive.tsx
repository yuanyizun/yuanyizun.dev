import Image from "next/image";
import Link from "next/link";
import { formatDisplayDate } from "@/utils/date";

type ArchivePost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
  alt: string;
};

const pageSize = 8;

export function PostArchive({
  posts,
  query,
  page,
}: {
  posts: ArchivePost[];
  query: string;
  page: number;
}) {
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? posts.filter((post) =>
        `${post.title} ${post.summary} ${post.content}`
          .toLowerCase()
          .includes(needle),
      )
    : posts;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);
  const [featured, ...rows] = visible;

  return (
    <div className="flex flex-col gap-8">
      <form action="/posts" className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="note-search" className="sr-only">
          Search notes
        </label>
        <input
          id="note-search"
          name="q"
          defaultValue={query}
          placeholder="Search notes"
          className="min-h-11 flex-1 rounded-md border border-border bg-background px-3 text-base"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground"
        >
          Search
        </button>
      </form>

      {filtered.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-xl bg-card p-6">
          <p>No notes match that search.</p>
          <Link href="/posts" className="w-fit text-sm no-underline hover:text-primary">
            Clear search
          </Link>
        </div>
      ) : (
        <>
          {featured ? (
            <Link
              href={`/posts/${featured.slug}`}
              className="grid gap-6 rounded-xl bg-card p-5 no-underline lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] lg:items-center"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  sizes="(min-width: 64rem) calc(0.35 * (min(100vw, 90rem) - 2 * clamp(1rem, 6.15vw, 5rem) - 4rem)), calc(100vw - 2 * clamp(1rem, 6.15vw, 5rem) - 2.5rem)"
                  className="object-cover grayscale"
                  preload
                />
              </div>
              <span className="flex flex-col gap-3">
                <time
                  dateTime={featured.date}
                  className="font-mono text-xs text-muted-foreground"
                >
                  {formatDisplayDate(featured.date)}
                </time>
                <span className="font-heading text-4xl tracking-heading">
                  {featured.title}
                </span>
                <span className="max-w-xl text-base leading-relaxed">
                  {featured.summary}
                </span>
              </span>
            </Link>
          ) : null}
          {rows.length > 0 ? (
            <ul>
              {rows.map((post) => (
                <li key={post.slug} className="border-t border-border">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="grid gap-2 py-5 no-underline sm:grid-cols-[8rem_minmax(0,1fr)]"
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
          ) : null}
          {pages > 1 ? (
            <nav aria-label="Pagination" className="flex gap-3 text-sm">
              {Array.from({ length: pages }, (_, index) => {
                const number = index + 1;
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                if (number > 1) params.set("page", String(number));
                const href = params.size ? `/posts?${params}` : "/posts";
                return (
                  <Link
                    key={number}
                    href={href}
                    aria-current={number === current ? "page" : undefined}
                    className={`inline-flex size-11 items-center justify-center rounded-md no-underline ${
                      number === current ? "bg-primary text-primary-foreground" : "bg-card"
                    }`}
                  >
                    {number}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
