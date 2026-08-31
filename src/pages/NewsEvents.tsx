import { EventMeta } from "@/components/EventMeta";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { images, upcomingEvents } from "@/data/content";
import { site } from "@/data/site";

/**
 * Round-7 (audit F-5): the page previously ended with the event grid — no
 * CTA, no outbound links, no closing band — so the journey stopped before the
 * parish's weekly touchpoints. Mirrors the Risen Christ sister port's pattern
 * routed to St Mary's verified channels: parish updates (stmary.sg/parish-updates),
 * Mass times, and the official Telegram channel. Event cards stay card-tint
 * (the card does not navigate; only the explicit Learn more link does — the
 * R6-01 affordance contract in src/pages/card-affordance.test.tsx).
 */
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
      >
        <Button href={site.parishUpdates} variant="outline-light">
          Parish updates
        </Button>
      </PageHero>

      <section className="bg-shrine-cream py-16 sm:py-24">
        <Container className="grid gap-5 md:grid-cols-2">
          {upcomingEvents.map((event, index) => (
            <Reveal key={event.title} delay={index * 50} className="h-full">
              <article className="card-tint flex h-full flex-col rounded-sm border border-shrine-stone bg-shrine-parchment p-7">
                <EventMeta category={event.category} date={event.date} />
                <h2 className="mt-3 font-display text-2xl">{event.title}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-shrine-charcoal/85">{event.summary}</p>
                {event.href ? (
                  <a
                    href={event.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="link-underline mt-4 w-fit text-sm text-shrine-maroon-600"
                  >
                    Learn more
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="relative overflow-hidden bg-shrine-maroon-950 py-20 sm:py-24">
        <div className="bg-gold-bloom pointer-events-none absolute inset-0" />
        <div className="bg-grain pointer-events-none absolute inset-0" />
        <Container className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-shrine-gold-300">
              Never miss a week
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl text-shrine-cream text-balance sm:text-4xl">
              The parish week keeps moving — stay in the conversation.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-shrine-cream/75">
              Announcements, feast preparations, and formation news are gathered on
              the parish updates page, and carried on the parish Telegram and
              Facebook channels.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-3">
              <Button href={site.parishUpdates} variant="outline-light">
                Open parish updates
              </Button>
              <Button
                to="/worship#mass"
                variant="ghost"
                className="text-shrine-cream/90 hover:bg-shrine-cream/10"
              >
                Mass times
              </Button>
            </div>
            <a
              href={site.telegram}
              rel="noopener noreferrer"
              target="_blank"
              className="link-underline text-sm text-shrine-cream/80"
            >
              Follow the parish on Telegram
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
