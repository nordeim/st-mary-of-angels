import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventMeta, categoryTone } from "@/components/EventMeta";

/**
 * Round-7 contract — closes audit findings F-1 (Medium) and F-2 (Low):
 * "UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist" §7 (docs/
 * remediation-plan-round7-2026-08-31.md).
 *
 * WCAG 2.2 AA 1.4.3 requires 4.5:1 for normal text. The chip label is
 * 0.65rem (≈10.4 px) bold uppercase — normal text, not large text — and the
 * date is 12–14 px. Both render on the parchment card surface #f2e9d6.
 *
 * These assertions are behavioral: ratios are computed from the token layer
 * in src/index.css, so the contract holds whichever token the tone map names
 * (a retone or a token value change re-verifies automatically). The previous
 * tones (gold-600, terracotta-500, charcoal/70) fail this contract at
 * 3.20:1, 3.92:1 and 4.16:1 respectively.
 */

const PARCHMENT = "#f2e9d6";
const CHARCOAL = "#423a2c";

function linear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(fg: string, bg: string): number {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Alpha-composite fg over bg (both opaque hex) and return the blended hex. */
function blendOver(fg: string, bg: string, alpha: number): string {
  const ch = (hex: string, i: number) =>
    parseInt(hex.replace("#", "").slice(i * 2, i * 2 + 2), 16);
  const out = [0, 1, 2].map((i) =>
    Math.round(ch(fg, i) * alpha + ch(bg, i) * (1 - alpha)),
  );
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** Parse the shrine color tokens out of index.css @theme. */
function shrineTokens(): Map<string, string> {
  // vitest runs with project root as cwd; import.meta.url is rewritten to a
  // non-file scheme under the jsdom transform, so resolve from the root.
  const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
  const tokens = new Map<string, string>();
  for (const m of css.matchAll(/--color-shrine-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens.set(m[1]!, m[2]!.toLowerCase());
  }
  return tokens;
}

/** "text-shrine-gold-600" -> token key "gold-600". */
function toneToken(className: string): string {
  const m = className.match(/text-shrine-([a-z0-9-]+)/);
  expect(m, `categoryTone class must name a shrine text color: ${className}`).not.toBeNull();
  return m![1]!;
}

describe("audit F-1: every event chip tone meets WCAG AA on parchment", () => {
  const tokens = shrineTokens();

  for (const [category, toneClass] of Object.entries(categoryTone)) {
    it(`${category} chip (${toneClass}) computes >= 4.5:1 on #f2e9d6`, () => {
      const token = toneToken(toneClass);
      const hex = tokens.get(token);
      expect(hex, `token --color-shrine-${token} must exist in index.css`).toBeTruthy();
      const ratio = contrast(hex!, PARCHMENT);
      // Report the measured ratio in the message for future audits.
      expect(
        ratio,
        `${category}: ${token} ${hex} on parchment is ${ratio.toFixed(2)}:1 (AA needs 4.5:1)`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("the chip border tint stays decorative gold-400/40 (audit: border unchanged)", () => {
    const { container } = render(<EventMeta category="Parish" date="1 January 2026" />);
    const chip = screen.getByText("Parish");
    expect(chip.className).toContain("border-shrine-gold-400/40");
    expect(container).toBeTruthy();
  });
});

describe("audit F-2: the event date meets WCAG AA on parchment", () => {
  it("date span charcoal alpha-blend computes >= 4.5:1 on #f2e9d6", () => {
    render(<EventMeta category="Parish" date="1 January 2026" />);
    const chip = screen.getByText("Parish");
    const row = chip.closest("p");
    expect(row).not.toBeNull();
    const dateSpan = row!.querySelectorAll("span")[1]!;
    const m = dateSpan.className.match(/text-shrine-charcoal\/(\d+)/);
    expect(m, `date span must tint shrine-charcoal with an explicit alpha: ${dateSpan.className}`).not.toBeNull();
    const alpha = Number(m![1]) / 100;
    const blended = blendOver(CHARCOAL, PARCHMENT, alpha);
    const ratio = contrast(blended, PARCHMENT);
    expect(
      ratio,
      `charcoal at /${m![1]} blends to ${blended} = ${ratio.toFixed(2)}:1 on parchment (AA needs 4.5:1)`,
    ).toBeGreaterThanOrEqual(4.5);
  });
});
