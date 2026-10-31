import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sections = [
  {
    href: "/posts",
    title: "Posts",
    description: "Notes stored as local markdown files.",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Project write-ups stored as local markdown files.",
  },
  {
    href: "/about",
    title: "About",
    description: "A short introduction.",
  },
  {
    href: "/contact",
    title: "Contact",
    description: "A placeholder contact form.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Showtime</h1>
        <p className="text-muted-foreground">
          A personal site. Pages below are placeholders.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
