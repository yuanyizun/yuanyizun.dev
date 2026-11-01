"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { NavKey } from "@/theme/contracts";
import { HeaderTicker } from "@/modules/header-ticker";

const links = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about", label: "About", key: "about" },
  { href: "/posts", label: "Posts", key: "posts" },
  { href: "/projects", label: "Projects", key: "projects" },
] as const;

const avatarSrc = "/images/yuanyizun-avatar.png";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderAvatar({ className }: { className?: string }) {
  return (
    <Avatar size="lg" className={cn("bg-background", className)}>
      <AvatarImage src={avatarSrc} alt="Yizun Yuan" className="grayscale" />
      <AvatarFallback className="bg-background text-foreground">
        YY
      </AvatarFallback>
    </Avatar>
  );
}

export function SiteHeader({ active }: { active?: NavKey }) {
  const pathname = usePathname();

  return (
    <header className="flex flex-col">
      <HeaderTicker />
      <div className="theme-container flex items-center justify-between gap-4 py-5">
        <div className="inline-flex items-center gap-3">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/about"
                  aria-label="Learn more about me!"
                  className="group rounded-full no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  <HeaderAvatar className="motion-safe:group-hover:animate-[spin_3s_linear_infinite]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Learn more about me!
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Link
            href="/"
            className="font-heading text-xl tracking-[-0.03em] no-underline"
          >
            Yizun Yuan
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => {
            const current = active
              ? active === link.key
              : isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`no-underline ${current ? "text-primary" : "text-foreground"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <ButtonLink href="/contact">Let&apos;s talk</ButtonLink>
        </nav>
        <Dialog.Root>
          <Dialog.Trigger className="inline-flex size-11 items-center justify-center rounded-md text-foreground md:hidden">
            <Menu aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-[#242823]/40" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col gap-8 bg-background px-6 py-5 outline-none">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-heading text-2xl tracking-[-0.03em]">
                  Menu
                </Dialog.Title>
                <Dialog.Close className="inline-flex size-11 items-center justify-center rounded-md">
                  <X aria-hidden="true" />
                  <span className="sr-only">Close menu</span>
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Site sections and contact.
              </Dialog.Description>
              <nav className="flex flex-col gap-2 text-2xl">
                {links.map((link) => {
                  const current = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={`py-2 no-underline ${current ? "text-primary" : ""}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <ButtonLink href="/contact" className="w-fit">
                Let&apos;s talk
              </ButtonLink>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
