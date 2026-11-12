import { SiteShell } from "@/components/composite/site-shell/site-shell";

export default function WebLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
