import { OrbitalCover } from "@/theme/covers";

export function ArticleCover({ title }: { title: string }) {
  return (
    <div className="overflow-hidden rounded-xl">
      <OrbitalCover title={title} />
    </div>
  );
}
