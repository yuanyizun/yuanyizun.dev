import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest, NextResponse } from "next/server";
import { runProxy, type ProxyStep } from "./chain";

test("a terminal response keeps cookies set by earlier steps", async () => {
  const request = new NextRequest("http://localhost:3002/dashboard");
  const steps: ProxyStep[] = [
    async (context) => {
      context.response.cookies.set("sb", "refreshed");
    },
    async (context) =>
      NextResponse.redirect(new URL("/login", context.request.url)),
  ];

  const response = await runProxy(request, steps);

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost:3002/login");
  assert.equal(response.cookies.get("sb")?.value, "refreshed");
});

test("steps after a terminal response do not run", async () => {
  let ran = false;
  const request = new NextRequest("http://localhost:3002/about");
  const steps: ProxyStep[] = [
    async () => NextResponse.next(),
    async () => {
      ran = true;
    },
  ];

  await runProxy(request, steps);

  assert.equal(ran, false);
});

test("a step can replace the response and let the pipeline continue", async () => {
  const request = new NextRequest("http://localhost:3002/about");
  const steps: ProxyStep[] = [
    async (context) => {
      const response = NextResponse.next({ request: context.request });
      response.headers.set("x-step", "session");
      context.response = response;
    },
    async (context) => {
      context.response.headers.set("x-next", "login");
    },
  ];

  const response = await runProxy(request, steps);

  assert.equal(response.headers.get("x-step"), "session");
  assert.equal(response.headers.get("x-next"), "login");
});
