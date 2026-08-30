import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { devotions, images } from "@/data/content";
import { site } from "@/data/site";

export function Worship() {
  return (
    <>
      <PageHero
        eyebrow="Worship"
        title="Mass, mercy, and a place to kneel"
        description={site.mass.note}
        image={images.sanctuary}
        fallback={images.heroFallback}
      />

      <section id="mass" className="scroll-mt-28 bg-shrine-cream py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The liturgy"
            title="Mass times"
            description="All Masses and services are held in the Main Church, Level 1, unless otherwise indicated."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal>
              <article className="rounded-sm border border-shrine-stone bg-shrine-parchment p-8">
                <Clock className="h-5 w-5 text-shrine-gold-600" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">Weekdays</h3>
                <p className="mt-3 text-sm leading-relaxed text-shrine-charcoal/85">
                  {site.mass.weekdayMorning}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-shrine-charcoal/85">
                  {site.mass.weekdayEvening}
                </p>
                <p className="mt-4 text-xs text-shrine-charcoal/70">
                  Public holidays usually 8.00 a.m. and 6.30 p.m., unless a Church Solemnity.
                </p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="rounded-sm border border-shrine-stone bg-shrine-parchment p-8">
                <Clock className="h-5 w-5 text-shrine-gold-600" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">Saturday</h3>
                <p className="mt-3 text-sm leading-relaxed text-shrine-charcoal/85">{site.mass.saturday}</p>
                <p className="mt-4 text-xs text-shrine-charcoal/70">
                  Syro-Malabar Malayalam Qurbana: 3rd Saturday, 7.00 p.m., St Clare Hall.
                </p>
              </article>
            </Reveal>
            <Reveal delay={160}>
              <article className="rounded-sm border border-shrine-stone bg-shrine-parchment p-8">
                <Clock className="h-5 w-5 text-shrine-gold-600" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">Sunday</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-shrine-charcoal/85">
                  {site.mass.sunday.map((time) => (
                    <li key={time}>{time}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-shrine-charcoal/70">
                  Sinhala 11.30 a.m. · Indonesian 4th Sunday 2.00 p.m. · Deaf Community 4.00 p.m. —
                  St Clare Hall unless announced.
                </p>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="confession" className="scroll-mt-28 bg-shrine-parchment py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Mercy"
            title="Confession & adoration"
            description="Come as you are. The confessionals and the Adoration Chapel are open houses of mercy."
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl">Sacrament of Reconciliation</h3>
              <p className="mt-3 leading-relaxed text-shrine-charcoal/85">{site.mass.confession}</p>
              <p className="mt-4 text-sm text-shrine-charcoal/75">
                Confessions may not be available when the parish friars are away or when special
                events occupy the Main Church. Thank you for your understanding.
              </p>
              <h3 className="mt-10 font-display text-2xl">Adoration Chapel</h3>
              <p className="mt-3 leading-relaxed text-shrine-charcoal/85">{site.mass.adoration}</p>
            </div>
            <div className="grid gap-4">
              {devotions.map((item) => (
                <article
                  key={item.title}
                  className="card-lift rounded-sm border border-shrine-stone bg-shrine-cream p-5"
                >
                  <h4 className="font-display text-lg">{item.title}</h4>
                  <p className="mt-1 text-sm text-shrine-maroon-600">{item.when}</p>
                  <p className="mt-1 text-sm text-shrine-charcoal/80">{item.where}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="visit" className="scroll-mt-28 bg-shrine-cream py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Find us"
            title="The hill in Bukit Batok"
            description={site.address.full}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div className="space-y-5 text-shrine-charcoal/85">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-shrine-gold-600" aria-hidden="true" />
                <span>
                  <strong className="text-shrine-maroon-700">MRT</strong> — {site.transport.mrt}
                  <br />
                  <strong className="text-shrine-maroon-700">Buses</strong> — {site.transport.buses}
                </span>
              </p>
              <p>
                Wheelchair ramps run from the Ave 6 bus stop to Level 1 and from Block 286 (near
                the market car park) to Level B2 (Gubbio). Enter by car along Bukit Batok East Ave
                2. Parking at B1 and B2; public car parks at Blocks 271 &amp; 269 and Bukit Batok
                Nature Park.
              </p>
              <p>
                <strong className="text-shrine-maroon-700">Reception</strong> — {site.hours.reception}
              </p>
              <p>
                Phone {site.contact.officePhone}. For Last Rites after hours, {site.contact.emergencyPhone}.
              </p>
              <Button href={site.mapsUrl}>Open in Google Maps</Button>
            </div>
            <div className="overflow-hidden rounded-sm border border-shrine-stone shadow-shrine">
              <iframe
                title="Map of Church of St Mary of the Angels"
                src={site.mapsEmbedSrc}
                className="h-[360px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
