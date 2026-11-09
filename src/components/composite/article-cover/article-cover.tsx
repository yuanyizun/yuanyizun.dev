import Image from "next/image";
import { containerContentSizes } from "@/components/primitive/container/container";

export function ArticleCover({
  alt,
  image,
  credit,
}: {
  alt: string;
  image: string;
  credit?: string;
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={alt}
          fill
          sizes={containerContentSizes}
          loading="eager"
          className="object-cover grayscale"
        />
      </div>
      {credit ? (
        <figcaption className="text-xs text-muted-foreground">{credit}</figcaption>
      ) : null}
    </figure>
  );
}
