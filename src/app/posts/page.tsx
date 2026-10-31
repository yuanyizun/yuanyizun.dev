import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
};

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="page-shell flex flex-col gap-12 py-12 sm:py-20">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="font-heading text-[clamp(3rem,8vw,5.5rem)] tracking-[-0.05em]">
          Notes
        </h1>
        <p className="text-[1.125rem] text-muted-foreground">
          Short writing stored as local markdown files.
        </p>
      </header>
      <ul className="mx-auto flex w-full max-w-[42rem] flex-col lg:ml-[12%]">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="grid gap-1 py-5 no-underline transition-opacity hover:opacity-70 sm:grid-cols-[minmax(0,1.4fr)_auto] sm:items-baseline sm:gap-8"
            >
              <span>
                <span className="block text-[1.15rem] font-semibold tracking-[-0.02em]">
                  {post.title}
                </span>
                <span className="mt-1 block text-[0.975rem] text-muted-foreground">
                  {post.summary}
                </span>
              </span>
              <time
                dateTime={post.date}
                className="text-[0.875rem] text-muted-foreground tabular-nums sm:text-right"
              >
                {post.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
