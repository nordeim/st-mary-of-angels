import { lifeTimeline } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function Timeline() {
  return (
    <ol className="relative border-l border-shrine-gold-400/70 pl-8">
      {lifeTimeline.map((entry, index) => (
        <li key={entry.year} className="relative pb-12 last:pb-0">
          <span className="dot-pulse absolute -left-[41px] top-1.5 h-3.5 w-3.5 rounded-full bg-shrine-gold-400 ring-4 ring-shrine-cream" />
          <Reveal delay={index * 60}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-shrine-maroon-500">
              {entry.year}
            </p>
            <h3 className="mt-1 font-display text-2xl text-shrine-maroon-700">{entry.title}</h3>
            <p className="mt-2 max-w-2xl leading-relaxed text-shrine-charcoal/85">{entry.description}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
