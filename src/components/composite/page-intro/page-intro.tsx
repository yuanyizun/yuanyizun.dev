import { ProfileImage } from "@/components/composite/profile-image/profile-image";

export function PageIntro({
  title,
  summary,
  mark,
}: {
  title: string;
  summary?: string;
  mark?: "profile";
}) {
  return (
    <div
      className={
        mark === "profile"
          ? "grid items-end gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(14rem,18rem)]"
          : "flex max-w-3xl flex-col gap-5"
      }
    >
      <div className="flex max-w-3xl flex-col gap-5">
        <h1 className="font-heading text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.98] tracking-[-0.035em]">
          {title}
        </h1>
        {summary ? (
          <p className="max-w-2xl text-lg leading-relaxed">{summary}</p>
        ) : null}
      </div>
      {mark === "profile" ? (
        <div className="max-w-xs overflow-hidden rounded-xl">
          <ProfileImage />
        </div>
      ) : null}
    </div>
  );
}
