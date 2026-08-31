import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NewsEvents } from "@/pages/NewsEvents";
import { site } from "@/data/site";
import { upcomingEvents } from "@/data/content";

/**
 * Round-7 contract — closes audit finding F-5: the News & Events page was a
 * hero plus a static grid — no CTA, no outbound links, no closing band — so
 * the journey ended before the parish's weekly touchpoints. The page now
 * mirrors the sibling site's pattern with St Mary's verified channels
 * (docs/remediation-plan-round7-2026-08-31.md): parish-updates CTA in the
 * hero, per-event "Learn more" links where a verified destination exists,
 * and a closing band routing to updates, Mass times, and Telegram.
 *
 * All destinations are canonical site.ts/content.ts facts (verified
 * stmary.sg URLs, 2026-08-31) — no invented bulletin URL: the parish
 * publishes no stable weekly-bulletin link, unlike the sibling.
 */
function renderPage() {
  return render(
    <MemoryRouter>
      <NewsEvents />
    </MemoryRouter>,
  );
}

describe("NewsEvents journey (audit F-5)", () => {
  it("the hero offers the parish updates CTA to the verified stmary.sg page", () => {
    renderPage();
    const cta = screen.getByRole("link", { name: "Parish updates" });
    expect(cta).toHaveAttribute("href", site.parishUpdates);
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Learn more links only for events with a verified destination", () => {
    renderPage();
    const withHref = upcomingEvents.filter((event) => Boolean(event.href));
    expect(withHref.length).toBeGreaterThan(0);

    const links = screen.getAllByRole("link", { name: "Learn more" });
    expect(links).toHaveLength(withHref.length);

    // DOM order follows the upcomingEvents order, so pair them positionally.
    links.forEach((link, i) => {
      expect(link).toHaveAttribute("href", withHref[i]!.href!);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("the closing band routes to parish updates, Mass times, and Telegram", () => {
    renderPage();
    const updates = screen.getByRole("link", { name: "Open parish updates" });
    expect(updates).toHaveAttribute("href", site.parishUpdates);

    const mass = screen.getByRole("link", { name: "Mass times" });
    expect(mass).toHaveAttribute("href", "/worship#mass");

    const telegram = screen.getByRole("link", { name: /telegram/i });
    expect(telegram).toHaveAttribute("href", site.telegram);
    expect(telegram).toHaveAttribute("target", "_blank");
  });
});
