import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/class-names";

const width = "mx-auto w-full max-w-[90rem] px-[clamp(1rem,6.15vw,5rem)]";

// Content box of `width`: 90rem frame, padding clamp(1rem, 6.15vw, 5rem) each side.
export const containerContentSizes =
  "(min-width: 90rem) 80rem, calc(100vw - 2 * clamp(1rem, 6.15vw, 5rem))";

type ContainerProps = {
  as?: "div" | "main" | "footer" | "header";
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "className">;

export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn(width, className)} {...props} />;
}
