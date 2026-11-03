import Image from "next/image";

export function ArticleCover({
  title,
  image,
  credit,
}: {
  title: string;
  image: string;
  credit?: string;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 47.5rem) 100vw, 47.5rem"
          className="object-cover grayscale"
        />
      </div>
      {credit ? (
        <figcaption className="text-xs text-muted-foreground">{credit}</figcaption>
      ) : null}
    </figure>
  );
}
