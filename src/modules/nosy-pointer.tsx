"use client";

import { useEffect, useRef } from "react";

const NATIVE_CURSOR =
  'input, textarea, [contenteditable]:not([contenteditable="false"]), iframe, [data-native-cursor]';

export function NosyPointer() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const pupils = [...cursor.querySelectorAll<SVGEllipseElement>(".nosy-pupil")];
    const lids = [...cursor.querySelectorAll<SVGGElement>(".nosy-lid")];
    const root = document.documentElement;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const contrast = window.matchMedia("(forced-colors: active)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let visible = false;
    let frame = 0;
    let x = 0;
    let y = 0;
    let gazeX = 0;
    let gazeY = 0;
    let targetX = 0;
    let targetY = 0;
    let blinkStart = Number.NEGATIVE_INFINITY;
    let lastMove = 0;

    function hide() {
      visible = false;
      cursor.style.visibility = "hidden";
      root.classList.remove("nosy-active");
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function render(now: number) {
      frame = 0;
      if (!visible) return;
      if (now - lastMove > 160) {
        targetX = 0;
        targetY = 0;
      }
      const ease = reduced.matches ? 1 : 0.22;
      gazeX += (targetX - gazeX) * ease;
      gazeY += (targetY - gazeY) * ease;
      const gaze = `translate(${gazeX} ${gazeY})`;
      for (const pupil of pupils) pupil.setAttribute("transform", gaze);
      const elapsed = now - blinkStart;
      const openness = elapsed < 180 ? Math.max(0.06, Math.abs(elapsed / 90 - 1)) : 1;
      const lid = `scale(1 ${openness})`;
      for (const group of lids) group.setAttribute("transform", lid);
      if (
        elapsed < 180 ||
        now - lastMove < 180 ||
        Math.abs(gazeX) + Math.abs(gazeY) > 0.02
      ) {
        frame = requestAnimationFrame(render);
      }
    }

    function wake() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    function move(event: PointerEvent) {
      if (!fine.matches || contrast.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      const target = event.target;
      if (target instanceof Element && target.closest(NATIVE_CURSOR)) {
        hide();
        return;
      }
      const dx = visible ? event.clientX - x : 0;
      const dy = visible ? event.clientY - y : 0;
      const length = Math.hypot(dx, dy);
      if (length > 0.2) {
        targetX = (dx / length) * 3.8;
        targetY = (dy / length) * 4.8;
      }
      x = event.clientX;
      y = event.clientY;
      lastMove = performance.now();
      cursor.style.transform = `translate3d(${x - 3}px,${y - 3}px,0)`;
      visible = true;
      cursor.style.visibility = "visible";
      root.classList.add("nosy-active");
      wake();
    }

    function press(event: PointerEvent) {
      if (!visible || event.pointerType !== "mouse") return;
      blinkStart = performance.now();
      wake();
    }

    function leave(event: PointerEvent) {
      if (!event.relatedTarget) hide();
    }

    function onVisibility() {
      if (document.hidden) hide();
    }

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerout", leave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", hide);
    fine.addEventListener("change", hide);
    contrast.addEventListener("change", hide);

    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", hide);
      fine.removeEventListener("change", hide);
      contrast.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} className="nosy-pointer" aria-hidden="true">
      <svg viewBox="0 0 52 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 3L3 49L15 39L24 59L33 55L24 35L44 34Z"
          fill="#fffdf5"
          stroke="#19191d"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        <g className="nosy-eye" transform="translate(21 23)">
          <g className="nosy-lid">
            <ellipse rx="9" ry="11" fill="white" stroke="#19191d" strokeWidth="2.4" />
            <ellipse className="nosy-pupil" rx="4.1" ry="5.3" fill="#19191d" />
          </g>
        </g>
        <g className="nosy-eye" transform="translate(37 20)">
          <g className="nosy-lid">
            <ellipse rx="10" ry="12" fill="white" stroke="#19191d" strokeWidth="2.4" />
            <ellipse className="nosy-pupil" rx="4.5" ry="5.8" fill="#19191d" />
          </g>
        </g>
      </svg>
    </div>
  );
}
