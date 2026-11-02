import type { ReactNode } from "react";
import { cn } from "@/utils/class-names";

export function AuthStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[min(70vh,36rem)] w-full flex-col items-center justify-center py-6 sm:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
