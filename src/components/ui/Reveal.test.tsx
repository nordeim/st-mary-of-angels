import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  const origIO = (globalThis as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
  const origMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.stubGlobal("matchMedia", () => ({ matches: false } as unknown as MediaQueryList));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    // restore jsdom setup's mocks
    if (origIO) {
      (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = origIO;
    }
    window.matchMedia = origMatchMedia;
  });

  it("shows content immediately under prefers-reduced-motion", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true } as unknown as MediaQueryList));
    render(<Reveal>hello</Reveal>);
    expect(screen.getByText("hello").className).toContain("reveal-visible");
  });

  it("falls back visible when IntersectionObserver is undefined (print/capture/print-preview)", async () => {
    // simulate capture/print environment without IO
    delete (globalThis as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    render(<Reveal>fallback</Reveal>);
    // effect runs after mount; wait a tick
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.getByText("fallback").className).toContain("reveal-visible");
  });

  it("has a @media print override that forces reveal visible", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const text = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
    expect(text).toContain("@media print");
    expect(text).toContain(".reveal");
    expect(text).toMatch(/opacity:\s*1\s*!important/);
  });
});
