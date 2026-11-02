import { OrbitalCover } from "@/components/composite/orbital-cover/orbital-cover";

export function ArticleCover({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <OrbitalCover title={title} />
    </div>
  );
}
