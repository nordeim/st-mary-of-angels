/* eslint-disable react-refresh/only-export-components */
import type { EventItem } from "@/data/content";

export type EventCategory = EventItem["category"];

export const categoryTone: Record<EventCategory, string> = {
  // Round-7 (audit F-1): gold-600 (3.20:1) and terracotta-500 (3.92:1) fall
  // below WCAG 2.2 AA 1.4.3 for this 0.65rem label on parchment #f2e9d6.
  // gold-700 computes 4.72:1; terracotta-600 computes 5.36:1. Contract:
  // src/components/wcag-contrast.test.tsx.
  Archdiocese: "text-shrine-terracotta-600",
  Devotion: "text-shrine-gold-700",
  Formation: "text-shrine-pine-600",
  Parish: "text-shrine-maroon-500",
};

interface EventMetaProps {
  category: EventCategory;
  date: string;
}

/** Round-5 chip system (docs/design-enhancement-round5-2026-08-30.md P-6):
 * bordered gold chip for the category + display-serif date beside it.
 * Single source for Home + NewsEvents — see audit R5-M1. */
export function EventMeta({ category, date }: EventMetaProps) {
  return (
    <p className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center rounded-full border border-shrine-gold-400/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${categoryTone[category]}`}
      >
        {category}
      </span>
      {/* Round-7 (audit F-2): charcoal/70 blends to 4.16:1 on parchment —
          below AA at this size. /85 blends to 6.19:1. Contract:
          src/components/wcag-contrast.test.tsx. */}
      <span className="font-display text-sm text-shrine-charcoal/85">{date}</span>
    </p>
  );
}
