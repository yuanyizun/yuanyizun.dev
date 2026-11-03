"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/primitive/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/composite/tooltip/tooltip";

function LinkedInIcon({ className }: { className?: string }) {
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
}

function RailButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={label}
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function ShareRail({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const actionsId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointerDown(event: MouseEvent | PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function onLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function onEmail() {
    const url = window.location.href;
    const href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
    window.location.assign(href);
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div
        ref={rootRef}
        className="flex flex-col items-start gap-2 min-[1200px]:fixed min-[1200px]:top-1/2 min-[1200px]:left-4 min-[1200px]:z-30 min-[1200px]:-translate-y-1/2"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Share"
              aria-expanded={open}
              aria-controls={actionsId}
              onClick={() => setOpen((value) => !value)}
            >
              <Share2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Share
          </TooltipContent>
        </Tooltip>

        <div
          id={actionsId}
          hidden={!open}
          className="flex flex-col items-start gap-2"
        >
          <RailButton
            label={copied ? "Copied" : "Copy link"}
            onClick={onCopy}
          >
            {copied ? <Check /> : <Link2 />}
          </RailButton>
          <RailButton label="Share on LinkedIn" onClick={onLinkedIn}>
            <LinkedInIcon className="size-4" />
          </RailButton>
          <RailButton label="Share by email" onClick={onEmail}>
            <Mail />
          </RailButton>
        </div>
      </div>
    </TooltipProvider>
  );
}
