import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { images, upcomingEvents } from "@/data/content";

const categoryTone: Record<(typeof upcomingEvents)[number]["category"], string> = {
  Parish: "text-shrine-maroon-500",
  Devotion: "text-shrine-gold-600",
  Formation: "text-shrine-pine-600",
  Archdiocese: "text-shrine-terracotta-500",
};

/** Round-5 chip system (docs/design-enhancement-round5-2026-08-30.md P-6):
 * bordered gold chip for the category + display-serif date beside it. */
function EventMeta({ category, date }: { category: string; date: string }) {
  return (
    <p className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex items-center rounded-full border border-shrine-gold-400/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${categoryTone[category as keyof typeof categoryTone]}`}
      >
        {category}
      </span>
      <span className="font-display text-sm text-shrine-charcoal/70">{date}</span>
    </p>
  );
}

export function NewsEvents() {
  return (
    <>
      <PageHero
        compact
        eyebrow="News & events"
        title="What's on at St Mary's"
        description="Parish life, Franciscan devotion, formation, and the wider Archdiocese."
        image={images.feast}
        fallback={images.heroFallback}
      />
      <section className="bg-shrine-cream py-16 sm:py-24">
        <Container className="grid gap-5 md:grid-cols-2">
          {upcomingEvents.map((event, index) => (
            <Reveal key={event.title} delay={index * 50} className="h-full">
              <article className="card-lift h-full rounded-sm border border-shrine-stone bg-shrine-parchment p-7">
                <EventMeta category={event.category} date={event.date} />
                <h2 className="mt-3 font-display text-2xl">{event.title}</h2>
                <p className="mt-3 leading-relaxed text-shrine-charcoal/85">{event.summary}</p>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>
    </>
  );
}
