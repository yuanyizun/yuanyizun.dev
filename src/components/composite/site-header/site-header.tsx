"use client";

import { useState, type ReactNode } from "react";
import { ExternalLink, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import portrait from "../../../../public/images/yuanyizun-avatar.png";
import { Dialog } from "radix-ui";
import { Avatar, AvatarFallback } from "@/components/primitive/avatar/avatar";
import { ButtonLink } from "@/components/primitive/button/button";
import { Container } from "@/components/primitive/container/container";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/composite/tooltip/tooltip";
import { SOCIAL_LINKS, type SocialLink } from "@/catalog/social-links";
import { cn } from "@/utils/class-names";
import { HeaderTicker } from "./header-ticker";
import "./site-header.module.css";

const links = [
  { href: "/", label: "Home", key: "home" },
  { href: "/about", label: "About", key: "about" },
  { href: "/posts", label: "Posts", key: "posts" },
  { href: "/projects", label: "Projects", key: "projects" },
  { href: "/interview", label: "Interview", key: "interview" },
  { href: "/contact", label: "Contact", key: "contact" },
  { href: "/dashboard", label: "Dashboard", key: "dashboard" },
] as const;

// Avatar size="lg" is size-10 (2.5rem). Fixed width asks for 1x and 2x, not a viewport srcset.
const headerAvatarPx = 40;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderAvatar({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <Avatar size="lg" className={cn("bg-background", className)}>
      {failed ? (
        <AvatarFallback className="bg-background text-foreground">
          YY
        </AvatarFallback>
      ) : (
        <Image
          src={portrait}
          alt="Yizun Yuan"
          width={headerAvatarPx}
          height={headerAvatarPx}
          loading="eager"
          fetchPriority="low"
          onError={() => setFailed(true)}
          className="aspect-square size-full rounded-full object-cover grayscale"
        />
      )}
    </Avatar>
  );
}

function SocialIcon({ id }: { id: string }) {
  const className = "size-5";
  switch (id) {
    case "linkedin":
      return (
        <svg
          aria-hidden="true"
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg
          aria-hidden="true"
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    default:
      return <ExternalLink aria-hidden="true" className={className} />;
  }
}

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {SOCIAL_LINKS.map((link: SocialLink) => (
        <a
          key={link.id}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="inline-flex size-11 items-center justify-center rounded-md text-foreground no-underline transition-colors hover:text-primary"
        >
          <SocialIcon id={link.id} />
        </a>
      ))}
    </div>
  );
}

export type NavKey =
  | "home"
  | "about"
  | "posts"
  | "projects"
  | "interview"
  | "contact"
  | "dashboard";

export function SiteHeader({
  active,
  accountDesktop,
  accountMobile,
}: {
  active?: NavKey;
  accountDesktop?: ReactNode;
  accountMobile?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header className="flex flex-col">
      <HeaderTicker />
      <Container className="flex items-center justify-between gap-4 py-5">
        <div className="inline-flex items-center gap-3">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/about"
                  aria-label="Learn more about me!"
                  className="group rounded-full no-underline"
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
            prefetch={false}
            className="font-brand text-[1.75rem] font-semibold leading-none tracking-[-0.01em] text-foreground no-underline"
          >
            Yizun Yuan
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-base md:flex">
          {links.map((link) => {
            const current = active
              ? active === link.key
              : isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={link.href === "/" ? false : undefined}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "navLinkSketch",
                  "no-underline",
                  current ? "text-primary" : "text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <SocialLinks />
          {accountDesktop}
          <ButtonLink href="/contact">Let&apos;s talk</ButtonLink>
        </nav>
        <Dialog.Root>
          <Dialog.Trigger className="inline-flex size-11 items-center justify-center rounded-md text-foreground md:hidden">
            <Menu aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/40" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col gap-8 bg-background px-6 py-5 outline-none">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-heading text-2xl tracking-heading">
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
                  const href =
                    link.key === "interview" ? "/interview/app" : link.href;
                  const current = isActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={href}
                      prefetch={link.href === "/" ? false : undefined}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "navLinkSketch",
                        "w-fit py-2 no-underline",
                        current ? "text-primary" : "",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <SocialLinks className="mt-2" />
              </nav>
              <div className="flex flex-col gap-3">
                {accountMobile}
                <ButtonLink href="/contact" className="w-fit">
                  Let&apos;s talk
                </ButtonLink>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Container>
    </header>
  );
}
