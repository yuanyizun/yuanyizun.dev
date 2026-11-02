import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/utils/class-names";

const styles = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[#9d3d24] focus-visible:outline-primary",
  outline:
    "border border-foreground/15 bg-transparent text-foreground hover:bg-card focus-visible:outline-foreground",
  inverse:
    "bg-primary text-primary-foreground hover:bg-[#9d3d24] focus-visible:outline-white",
} as const;

type Variant = keyof typeof styles;

const base =
  "inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-medium no-underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(base, styles[variant], className)} {...props} />;
}

export function ButtonAnchor({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={cn(base, styles[variant], className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(base, styles[variant], className)}
      {...props}
    />
  );
}
