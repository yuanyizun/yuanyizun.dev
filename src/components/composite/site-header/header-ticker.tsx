"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { HEADER_TICKER } from "@/catalog/header-ticker";
import { cn } from "@/utils/class-names";
import "./header-ticker.module.css";

const DRAG_THRESHOLD_PX = 4;
const SEPARATOR = " · ";

type DragState = {
  pointerId: number;
  startClientY: number;
  originTop: number;
  moved: boolean;
};

export function HeaderTicker() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [floatingTop, setFloatingTop] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);

  const items = HEADER_TICKER.items;
  const phrase = items.join(SEPARATOR);
  const isFloating = floatingTop !== null;

  const clampTop = useCallback((top: number, height: number) => {
    const max = Math.max(0, window.innerHeight - height);
    return Math.min(Math.max(0, top), max);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const el = rootRef.current;
    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startClientY: event.clientY,
      originTop: isFloating ? floatingTop! : rect.top,
      moved: false,
    };
    try {
      el.setPointerCapture(event.pointerId);
    } catch {
      // Capture can fail for synthetic or non-primary pointers; drag still works via bubbled moves.
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = rootRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !el) {
      return;
    }

    const deltaY = event.clientY - drag.startClientY;
    if (!drag.moved && Math.abs(deltaY) < DRAG_THRESHOLD_PX) {
      return;
    }

    if (!drag.moved) {
      drag.moved = true;
      setDragging(true);
      setSpacerHeight(el.getBoundingClientRect().height);
    }

    const nextTop = clampTop(
      drag.originTop + deltaY,
      el.getBoundingClientRect().height,
    );
    setFloatingTop(nextTop);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    setDragging(false);

    const el = rootRef.current;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
  };

  useEffect(() => {
    if (!isFloating) {
      return;
    }

    const onResize = () => {
      const el = rootRef.current;
      if (!el) {
        return;
      }
      setFloatingTop((top) =>
        top === null ? top : clampTop(top, el.getBoundingClientRect().height),
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampTop, isFloating]);

  return (
    <>
      {isFloating ? (
        <div
          aria-hidden="true"
          className="w-full shrink-0"
          style={{ height: spacerHeight }}
        />
      ) : null}
      <div
        ref={rootRef}
        role="region"
        aria-label="Availability"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "z-30 w-full select-none bg-inverse text-inverse-foreground",
          "cursor-grab touch-none active:cursor-grabbing",
          dragging && "headerTickerDragging",
          dragging && "cursor-grabbing",
          isFloating && "fixed left-0",
        )}
        style={isFloating ? { top: floatingTop } : undefined}
      >
        <p className="sr-only">{phrase}</p>
        <div className="overflow-hidden" aria-hidden="true">
          <div className="headerTickerTrack">
            <TickerSegment phrase={phrase} />
            <TickerSegment phrase={phrase} />
          </div>
          <p className="headerTickerStatic">{phrase}</p>
        </div>
      </div>
    </>
  );
}

function TickerSegment({ phrase }: { phrase: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-3 px-4 py-2 font-mono text-xs tracking-[0.04em] uppercase sm:text-sm">
      <span className="text-primary" aria-hidden="true">
        ●
      </span>
      <span>{phrase}</span>
      <span className="text-primary" aria-hidden="true">
        ●
      </span>
    </span>
  );
}
