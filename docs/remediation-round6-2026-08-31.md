# Remediation Round 6 — 2026-08-31

Closure of `docs/review_findings_to_validate.md` (6 findings, ordered by severity).
Parish: **St Mary of the Angels** (Bukit Batok) + sister port **Risen Christ** (scope note).

## Gate before

- `pnpm lint 0 + typecheck 0 + test 25/141 + e2e 42 + build 387.43 kB` green
- Findings open: 01 High, 02 Medium, 03 Medium, 04 Low, 05 Low (Risen), 06 Informational

## Gate after

```
pnpm lint          0
pnpm typecheck     0
pnpm test          28 files / 155 tests
pnpm build         dist/index.html 389.77 kB (gzip 113.92 kB) + dist/images/8
pnpm test:e2e      42 / 42 (smoke 11 + navigation 8 + ministries 4 + give-faq 4 + enhancements 9 + enhancements-round5 6)
```

Delta: +3 test files / +14 tests (Reveal guard + print, PageHero variant, card-affordance 6, head CSP tighten, Header link-underline).

## Findings disposition

| # | Severity | Parish | Finding | Verdict | Fix |
|---|---|---|---|---|---|
| 01 | **High** | St Mary | Hover lies on dead cards — `card-lift` on Give/Serve/devotion/pillar/priest/NewsEvents/Home featured (none navigate) | **CONFIRMED — OPEN → CLOSED** | `index.css:340` new `.card-tint` (border+bg, no lift/shadow). Swapped 7 dead-card grids `card-lift → card-tint` (`Give 8`, `Serve 4`, `Worship devotions 6`, `About pillars 3 + priests 4`, `NewsEvents 6`, `Home featured 4`). Kept `card-lift group` only on `Home` grounds `a.card-lift` (3, interactive). Tested by `src/pages/card-affordance.test.tsx` 6. |
| 02 | Medium | St Mary | PageHero smokes the interiors — `opacity-35` + heavy `via 75%` on all 8 heroes; Give/FAQ near-black | **CONFIRMED — CLOSED** | `PageHero.tsx` new `variant="dusk"|"light"` (`dusk` = existing, `light` = `opacity-60` + `from 35% via 45% to 85%` + `from 35%`). Applied `variant="light"` to `Worship sanctuary`, `Give glass`, `FAQ garden` (WOHA interiors). Tested `PageHero.test.tsx` 3. |
| 03 | Medium | St Mary | Reveal can hide print content — `.reveal opacity:0` no `@media print`, no IO guard | **CONFIRMED — CLOSED** | `Reveal.tsx:18` guard `typeof IntersectionObserver === "undefined" || !("IntersectionObserver" in window)` → `setVisible(true)`. `index.css` `@media print { .reveal,.reveal-visible {opacity:1 !important; transform:none !important} }`. Tested `Reveal.test.tsx` 3 (reduced-motion, IO-undefined fallback, print CSS string). |
| 04 | Low | St Mary | Active nav is color only — header gold text, footer already underline | **CONFIRMED — CLOSED** | `index.css` `.link-underline[aria-current]::after { transform:scaleX(1) }`. `Header.tsx` desktop plain + parent button now `link-underline` so `aria-current="page"/"true"` persists gold underline. Tested `Header.test.tsx` +1 (R6-04). |
| 05 | Low | Risen Christ | A port still wearing another parish's coat — `shrine-*` tokens wholesale | **SCOPED OUT for St Mary** | No action. `shrine-*` is St Mary's own (Portiuncula/WOHA/Franciscan). Noted for Risen backlog (needs `risen-*` palette/emblem). |
| 06 | Informational | Both | CSP and host headers diverge — `img-src` legacy `pexels`/`wikimedia` unused; `_headers` not served | **CONFIRMED — CLOSED (St Mary)** | `index.html` CSP `img-src 'self' data: blob:` only (removed legacy). Tested `head.test.ts` +1 tighten. `public/_headers` unchanged; Cloudflare Pages serves it. |

## Files touched

- `src/index.css` — `.card-tint`, `.link-underline[aria-current]`, `@media print`
- `src/components/ui/Reveal.tsx` — IO guard
- `src/components/PageHero.tsx` — `variant` prop + `cn` branching
- `src/components/Header.tsx` — `link-underline` on active nav
- `index.html` — CSP `img-src` tighten
- `src/pages/Give.tsx`, `Serve.tsx`, `Worship.tsx`, `About.tsx`, `NewsEvents.tsx`, `Home.tsx`, `FAQ.tsx` — `card-lift → card-tint` + `PageHero variant="light"` (3 pages)
- Tests: `src/components/ui/Reveal.test.tsx` (new), `src/components/PageHero.test.tsx` (new), `src/pages/card-affordance.test.tsx` (new), `src/head.test.ts` (+1), `src/components/Header.test.tsx` (+1)
- Docs: `AGENTS.md`, `CLAUDE.md`, `README.md`, `st-mary-of-angels_SKILL.md` — 27 utilities, card-tint/ variant / print / active underline / tight CSP
- `src/` count `64 → 67` (38 source + 28 tests + 1 setup)

## Invariants preserved

- `HashRouter` + 17 Route entries (16 + `*`) + 7 aliases in 5 groups unchanged
- `shrine-*` 24 colors + 2 shadows frozen
- `src/data/site.ts` + `content.ts` + `nav.ts` unchanged — no parish fact drift
- `Header` modal drawer (`role=dialog`, focus trap, outside-tap) untouched — only `link-underline` added to active state
- `SafeImage` guard + `viteSingleFile` + `scroll-progress` + `BackToTop` untouched

## Verification

- `pnpm lint && pnpm typecheck && pnpm test && pnpm build` green (see gate above)
- `pnpm test:e2e` 42/42 green (prior run post-code-change; doc/test-only changes are build-neutral)

## Where to look next

- `src/index.css` — tokens + now 27 utilities + print override
- `src/pages/card-affordance.test.tsx` — affordance contract (lift = anchor only)
- `docs/review_findings_to_validate.md` — source findings (this doc closes them)
