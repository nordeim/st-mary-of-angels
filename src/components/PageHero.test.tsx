import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHero } from "./PageHero";

describe("PageHero", () => {
  it("defaults to dusk variant (opacity-35, heavy gradients)", () => {
    const { container } = render(
      <PageHero eyebrow="Test" title="Dusk hero" image="/images/hero-church.jpg" />,
    );
    expect(container.querySelector(".opacity-35")).not.toBeNull();
    expect(container.querySelector(".from-shrine-maroon-950\\/50")).not.toBeNull();
    expect(container.innerHTML).toContain("opacity-35");
  });

  it("light variant is more luminous (opacity-60, lighter gradients) for WOHA interiors", () => {
    const { container } = render(
      <PageHero
        variant="light"
        eyebrow="Test"
        title="Light hero"
        image="/images/sanctuary.jpg"
      />,
    );
    expect(container.querySelector(".opacity-60")).not.toBeNull();
    expect(container.innerHTML).toContain("opacity-60");
    expect(container.innerHTML).toContain("from-shrine-maroon-950/35");
    expect(container.innerHTML).not.toContain("from-shrine-maroon-950/50");
  });

  it("accepts compact + variant together (Give/FAQ compact light)", () => {
    render(
      <PageHero
        compact
        variant="light"
        eyebrow="Questions"
        title="Before you come"
        image="/images/rosary-garden.jpg"
      />,
    );
    expect(screen.getByText("Before you come")).toBeInTheDocument();
    // compact + light should both apply
    const section = screen.getByText("Before you come").closest("section")!;
    expect(section.className).toContain("pt-28");
  });
});
