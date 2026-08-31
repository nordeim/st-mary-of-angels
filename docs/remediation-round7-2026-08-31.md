# Remediation Round 7 — 2026-08-31

Closure of the comparative UI/UX audit **"UI/UX Design Audit — St Mary of the Angels vs
Risen Christ"** (findings F-1 … F-9; markdown reference in
`docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md`; plan executed verbatim from
`docs/remediation-plan-round7-2026-08-31.md`).
Parish: **St Mary of the Angels** (Bukit Batok) + scope note for the Risen Christ port.

Method: TDD — every fix landed as a failing test first (red observed and quoted below),
then the fix, then the full gate. All commits to `main`; no new branches.

## Gate before

- `pnpm lint` 0 + `typecheck` 0 + `test` 28 files / 155 + `build` 389.77 kB + `e2e` 42 — green
- F-3 reproduced before fixing: `http://localhost:5173/worship` rendered the Home hero
  ("According to Thy Word.") while the address bar showed `/worship` (audit's soft-404)

## Gate after

```
pnpm lint          0
pnpm typecheck     0
pnpm test          31 files / 172 tests — green
pnpm build         dist/index.html 392.50 kB (gzip 114.60 kB) + dist/images/8
pnpm test:e2e      45 / 45 (smoke 11 + navigation 8 + ministries 4 + give-faq 4 +
                   enhancements 9 + enhancements-round5 6 + deep-links 3)
```

Delta: +3 test files / +17 tests (wcag-contrast 6, deepLinks 7, news-events-journey 3,
site +1); +1 e2e spec / +3 tests; +1 source module (`src/utils/deepLinks.ts`).
Build grew +2.73 kB raw / +0.68 kB gzip (plan estimated < +2 kB raw; the NewsEvents
band markup + deepLinks module account for the difference — recorded as measured).

## Findings disposition

| # | Severity | Finding (audit §7) | Verdict | Fix |
|---|---|---|---|---|
| F-1 | **Medium** | Event chip text below AA (Devotion gold-600 3.20:1, Archdiocese terracotta-500 3.92:1 on parchment) | **CONFIRMED — CLOSED** | `src/index.css` `@theme` adds `--color-shrine-gold-700: #85601f` (4.72:1) and `--color-shrine-terracotta-600: #8f4c30` (5.36:1); `categoryTone` retone in `EventMeta.tsx`. Contract: `src/components/wcag-contrast.test.tsx` — ratios computed from the token layer. Red observed: 3.20:1 / 3.92:1 (exactly the audit's math). |
| F-2 | Low | Event date `charcoal/70` blends to 4.16:1 | **CONFIRMED — CLOSED** | Date span → `text-shrine-charcoal/85` (6.19:1 blended). Same contract test. Red observed: 4.16:1. |
| F-3 | Low | Path-style deep links silently render Home | **CONFIRMED (reproduced) — CLOSED** | `src/utils/deepLinks.ts` (`knownRoutePaths` 16 paths + `resolveHashRedirect`) wired in `src/main.tsx` before mount via `location.replace`. HashRouter retained (documented single-file tradeoff). Tests: `src/utils/deepLinks.test.ts` 7 (incl. drift guard against `App.tsx` literals) + `e2e/deep-links.spec.ts` 3. Red observed: e2e 3/3 landed on Home. |
| F-4 | Low | RC Give page UEN as display heading | **OUT OF SCOPE — Risen Christ repo** | No action here. Noted for the Risen backlog. |
| F-5 | Low | News & Events journey ends early | **CONFIRMED — CLOSED** | `NewsEvents.tsx` adopts the sibling's pattern on St Mary's verified channels: hero CTA "Parish updates" (stmary.sg/parish-updates, HTTP 200 2026-08-31), per-event "Learn more" links on the two events with verified destinations (`/wyd`, `/franciscanjubilee`), closing dark band routing to updates + `/worship#mass` + Telegram. Data: `site.parishUpdates`, `href` on 2 of 6 events. Tests: `src/pages/news-events-journey.test.tsx` 3 + `site.test.ts` +1. Cards stay `card-tint` (R6-01 contract intact). |
| F-6 | Informational | Synthetic-image artifacts | **DEFERRED (as audit)** | Needs real parish photography. |
| F-7 | Informational | Scroll-reveal blanks reader-mode captures | **NO ACTION (as audit)** | Fallbacks already shipped (rounds 5–6). |
| F-8 | Informational | 2.4 MB images | **DEFERRED (as audit)** | Responsive variants with F-6. |
| F-9 | Informational | RC `src.orig/` hygiene | **OUT OF SCOPE — Risen Christ repo** | No action here. |

## Evidence-based deviations from the audit's example values (documented, not silent)

1. **gold-700 value.** The audit suggested "gold-700 ≈ #8a6224, about 4.9:1"; precise
   computation gives **4.52:1** — a 0.02 margin that subpixel rendering can erode on
   10.4 px text. Shipped `#85601f` = **4.72:1** with real margin, still the audit's
   "one step darker gold".
2. **F-5 destination.** The audit's fix names a "bulletin" (Risen Christ's weekly
   word). St Mary's publishes no stable weekly-bulletin URL — verified 2026-08-31:
   `stmary.sg/bulletin`, `/weekly-bulletin`, `/parish-bulletin` → 404. The pattern is
   implemented on the parish's canonical touchpoint instead: the **Parish Updates**
   page (+ official Telegram), exactly the channels the audit said were
   "not surfaced at the point where a parishioner is already looking for what's on".

## Files touched

- `src/index.css` — `@theme` +`gold-700`, +`terracotta-600` (scale extension; no existing token mutated, 24 → 26 colors)
- `src/components/EventMeta.tsx` — `categoryTone` retone + date `/70` → `/85`
- `src/utils/deepLinks.ts` — new: route table + `resolveHashRedirect`
- `src/main.tsx` — pre-mount redirect wiring
- `src/data/site.ts` — +`parishUpdates` (verified URL)
- `src/data/content.ts` — +`href` on WYD briefing + Franciscan Jubilee events
- `src/pages/NewsEvents.tsx` — hero CTA, per-event links, closing band
- Tests: `src/components/wcag-contrast.test.tsx` (new), `src/utils/deepLinks.test.ts` (new), `src/pages/news-events-journey.test.tsx` (new), `src/data/site.test.ts` (+1)
- E2E: `e2e/deep-links.spec.ts` (new, 3)
- Docs: `README.md`, `AGENTS.md`, `CLAUDE.md`, `st-mary-of-angels_SKILL.md`, `docs/remediation-plan-round7-2026-08-31.md` (plan), this closure record, `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md` (audit reference)
- `src/` count `67 → 71` (39 source + 31 tests + 1 setup)

## Invariants preserved

- `HashRouter` + 17 Route entries unchanged — F-3 fix is additive, known routes only
- Existing `shrine-*` tokens untouched — only new scale steps added
- `card-tint` affordance contract (R6-01) green — event cards still do not lift
- Header drawer, SafeImage, singlefile build, scroll-progress, BackToTop untouched
- No test deleted, skipped, or weakened; no lint/type rule loosened
- No invented parish facts — every new URL verified HTTP 200 on 2026-08-31

## Verification

- All gates green after each TDD cycle and at final state (see Gate after)
- Live DOM evidence (dev server, 1440×900): `/news-events` → `#/news-events`
  (F-3), chip `text-shrine-maroon-500` + gold border with date
  `text-shrine-charcoal/85` (F-1/F-2), hero CTA + closing band rendered (F-5);
  screenshots kept out of the repo under the working audit folder

## Where to look next

- `src/utils/deepLinks.ts` — extend `knownRoutePaths` together with any new `App.tsx` route (drift guard enforces it)
- `src/components/wcag-contrast.test.tsx` — any new chip tone re-verifies against AA automatically
- `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md` — the source audit for future rounds
