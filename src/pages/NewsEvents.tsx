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
            <Reveal key={event.title} delay={index * 50}>
              <article className="card-lift h-full rounded-sm border border-shrine-stone bg-shrine-parchment p-7">
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.2em] ${categoryTone[event.category]}`}
                >
                  {event.category} · {event.date}
                </p>
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
