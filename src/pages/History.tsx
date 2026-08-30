import { PageHero } from "@/components/PageHero";
import { Timeline } from "@/components/Timeline";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/data/content";

export function History() {
  return (
    <>
      <PageHero
        eyebrow="1957–2026"
        title="From a hilltop chapel to a house of light"
        description="Friars on a Bukit Batok hill, a parish named for Assisi, and a church that won the President's Design Award."
        image={images.hero}
        fallback={images.heroFallback}
      />
      <section className="bg-shrine-cream py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="The story"
              title="A little portion of land"
              description="The Portiuncula — 'the little portion' — was the chapel of Our Lady of the Angels that St Francis rebuilt, and the place he chose to die. This parish bears that name."
            />
            <p className="mt-6 leading-relaxed text-shrine-charcoal/85">
              In 1957 the Friars Minor were sent to Singapore to found a sociological institute.
              A year later Archbishop Michel Olçomendy dedicated their hilltop chapel. Neighbours
              walked up through orchards and kampongs to join the brothers for Mass.
            </p>
            <p className="mt-4 leading-relaxed text-shrine-charcoal/85">
              In 1970 the chapel became a parish. The west of the island filled; the church was
              rebuilt. In 2004 WOHA's folded planes of concrete and timber were consecrated — a
              house where Mary at the west of the garden still looks toward her Son.
            </p>
          </div>
          <Timeline />
        </Container>
      </section>
    </>
  );
}
