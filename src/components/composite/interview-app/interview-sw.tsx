"use client";

import { useEffect } from "react";

export function InterviewSw() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/interview/app/sw.js", {
      scope: "/interview/app/",
    });
  }, []);

  return null;
}
