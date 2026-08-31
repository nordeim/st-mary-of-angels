import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Home } from "./Home";
import { About } from "./About";
import { Give } from "./Give";
import { Serve } from "./Serve";
import { NewsEvents } from "./NewsEvents";
import { Worship } from "./Worship";

/** Round-6 R6-01: card-lift is reserved for interactive cards only.
 *  Dead cards (Give/Serve/devotion/pillar/priest/event) must use card-tint
 *  (no lift/shadow). Only Home grounds Links stay card-lift. */

describe("card affordance (R6-01)", () => {
  it("Home grounds Links are the only card-lift cards", () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    const lifts = container.querySelectorAll(".card-lift");
    // 3 grounds + Button lift? Buttons don't carry card-lift; only grounds should.
    // Home grounds are <Link class="card-lift group"> — 3
    const groundsLifts = container.querySelectorAll("a.card-lift");
    expect(groundsLifts.length).toBe(3);
    // ensure lifts are all anchors (interactive)
    lifts.forEach((el) => expect(el.tagName.toLowerCase()).toBe("a"));
    // dead featured events must be card-tint, not card-lift
    const tints = container.querySelectorAll(".card-tint");
    expect(tints.length).toBeGreaterThanOrEqual(4); // 4 featured events
  });

  it("About pillars and priest cards are card-tint (dead)", () => {
    const { container } = render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    );
    expect(container.querySelectorAll(".card-lift").length).toBe(0);
    expect(container.querySelectorAll(".card-tint").length).toBe(7); // 3 pillars + 4 priests
  });

  it("Give 8 options are card-tint", () => {
    const { container } = render(
      <MemoryRouter>
        <Give />
      </MemoryRouter>,
    );
    expect(container.querySelectorAll(".card-lift").length).toBe(0);
    expect(container.querySelectorAll(".card-tint").length).toBe(8);
  });

  it("Serve 4 roles are card-tint", () => {
    const { container } = render(
      <MemoryRouter>
        <Serve />
      </MemoryRouter>,
    );
    expect(container.querySelectorAll(".card-lift").length).toBe(0);
    expect(container.querySelectorAll(".card-tint").length).toBe(4);
  });

  it("NewsEvents 6 events are card-tint", () => {
    const { container } = render(
      <MemoryRouter>
        <NewsEvents />
      </MemoryRouter>,
    );
    expect(container.querySelectorAll(".card-lift").length).toBe(0);
    expect(container.querySelectorAll(".card-tint").length).toBe(6);
  });

  it("Worship devotion cards are card-tint (not lift)", () => {
    const { container } = render(
      <MemoryRouter>
        <Worship />
      </MemoryRouter>,
    );
    // devotions are 6 card-tint articles
    const tints = container.querySelectorAll(".card-tint");
    // includes 6 devotions; MassCards are not lift/tint
    expect(tints.length).toBe(6);
    // none of the devotion cards should be card-lift
    expect(container.querySelectorAll(".card-lift").length).toBe(0);
  });
});
