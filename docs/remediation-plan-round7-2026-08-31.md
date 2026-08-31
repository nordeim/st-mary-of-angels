# Remediation Plan — Round 7 — 2026-08-31

Closes the findings of the comparative UI/UX design audit
**"UI/UX Design Audit — St Mary of the Angels vs Risen Christ"** (14-page PDF,
2026-08-31; markdown reference copied to `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md`).
Parish: **St Mary of the Angels** (Bukit Batok). Sister port Risen Christ is out of scope here.

Method: **TDD** — every fix lands as a failing test first (red), then the fix (green),
then the full gate. No new branches; all commits go to `main`.

## Gate before (measured 2026-08-31)

```
pnpm lint          0 (eslint . --max-warnings 0)
pnpm typecheck     0 (tsc --noEmit)
pnpm test          28 files / 155 tests — all green
pnpm build         dist/index.html 389.77 kB (gzip 113.92 kB)
pnpm test:e2e      42 / 42 (chromium)
```

Defect reproduced before fixing (F-3): opening `http://localhost:5173/worship`
directly renders the Home hero ("According to Thy Word.") while the address bar
shows `/worship` — the soft-404 the audit recorded on the deployed site.

## Findings disposition

| # | Severity | Finding (audit §7) | Verdict | Fix |
|---|---|---|---|---|
| F-1 | **Medium** | Event-category chip text below AA contrast (`EventMeta.tsx` `categoryTone`) | **CONFIRMED — OPEN → CLOSING** | Add gold-700 / terracotta-600 token steps in `src/index.css` `@theme`; retone `Archdiocese → terracotta-600`, `Devotion → gold-700` in `categoryTone`. Contract test computes WCAG ratios from the token layer. |
| F-2 | Low | Event date `text-shrine-charcoal/70` blends to ~4.16:1 | **CONFIRMED — OPEN → CLOSING** | Raise date span to `text-shrine-charcoal/85` (6.19:1 computed). Same contract test covers it. |
| F-3 | Low | Path-style deep links (`/worship`) silently render Home | **CONFIRMED — reproduced locally** | Keep HashRouter (single-file deployment is a documented tradeoff). Add `src/utils/deepLinks.ts` — known-route table + `resolveHashRedirect()` — wired in `src/main.tsx` before mount; unknown paths left to existing behavior. Unit tests + drift guard against `App.tsx` + Playwright spec. |
| F-4 | Low | RC Give page UEN as display heading | **OUT OF SCOPE — Risen Christ repo** | No action in this repository. Noted for Risen backlog. |
| F-5 | Low | News & Events journey ends early (no CTA, no outbound links, no closing band) | **CONFIRMED — OPEN → CLOSING** | Adopt the sibling's pattern with SMA's **verified** channels: hero CTA + closing band routing to the parish updates page and Mass times, Telegram link surfaced, optional per-event "Learn more" links. Data: `site.parishUpdates` + `href` on the two events with verified destinations. |
| F-6 | Informational | Synthetic-image artifacts in 1–2 photos | **DEFERRED (as audit)** | Needs real parish photography; documented tradeoff. |
| F-7 | Informational | Scroll-reveal blanks reader-mode captures | **NO ACTION (as audit)** | Reduced-motion / no-IO / print fallbacks already shipped (rounds 5–6). |
| F-8 | Informational | 2.4 MB images, lazy + eager hero | **DEFERRED (as audit)** | Responsive variants when real photography lands (pairs with F-6). |
| F-9 | Informational | RC repo `src.orig/` hygiene | **OUT OF SCOPE — Risen Christ repo** | No action in this repository. |

## Fix detail and evidence

### F-1 + F-2 — chip and date contrast (shared file: `src/components/EventMeta.tsx`)

Measured with the repo's own token values (relative-luminance, WCAG 2.x):

| Tone | Current | Current ratio | New | New ratio |
|---|---|---|---|---|
| Devotion chip | gold-600 `#a67a2e` | 3.20:1 | **gold-700 `#85601f`** | **4.72:1** |
| Archdiocese chip | terracotta-500 `#ab5f3c` | 3.92:1 | **terracotta-600 `#8f4c30`** | **5.36:1** |
| Formation chip | pine-600 `#26402f` | 9.37:1 | unchanged | — |
| Parish chip | maroon-500 `#7c2a25` | 7.86:1 | unchanged | — |
| Date span | charcoal/70 → `#776e5f` | 4.16:1 | **charcoal/85 → `#5c5446`** | **6.19:1** |

Two deliberate, documented deviations from the audit's example values:

- The audit suggested gold-700 ≈ `#8a6224` "about 4.9:1"; precise computation gives
  **4.52:1** — technically passing but with a 0.02 margin that subpixel rendering
  can erode on 10.4 px text. Chosen `#85601f` computes to **4.72:1** with real
  margin while remaining the audit's "one step darker gold".
- Terracotta-600 `#8f4c30` matches the audit's example and computes to **5.36:1**
  (audit said ~5.3:1). Adopted as proposed.

Chip borders (`border-shrine-gold-400/40`) are decorative, not text — unchanged,
per the audit's "keeping the border tint as is".

Note on the round-6 invariant "shrine-* 24 colors frozen": this change **extends**
the gold and terracotta scales with new steps; it does not mutate any existing
token. All existing usances render identically.

Tests (new `src/test/wcag-contrast.test.ts`):

1. Parse `src/index.css` `@theme` tokens → hex map.
2. For every entry of `categoryTone`, resolve `text-shrine-*` → hex, compute
   contrast vs parchment `#f2e9d6`, assert ≥ 4.5 (WCAG 2.2 AA 1.4.3; the chip is
   0.65rem ≈ 10.4 px bold — normal text, not large text).
3. Render `EventMeta`, read the date span's opacity step from its class, blend
   charcoal over parchment at that alpha, assert ≥ 4.5.

Red state before the fix: current tones compute 3.20/3.92/4.16 → assertions fail.

### F-3 — path-style deep links

The audit's two options: (a) BrowserRouter + host SPA rewrite, or (b) keep
HashRouter + rewrite known path routes to hash equivalents on load. This repo
ships via `vite-plugin-singlefile` to hosts without rewrite config (the
`_headers` file serves headers, not rewrites), so **option (b)** is the faithful
fix — matching the audit's fallback recommendation and the HashRouter rationale
comment in `src/App.tsx`.

New `src/utils/deepLinks.ts`:

- `knownRoutePaths`: every concrete path from `src/App.tsx` (16 concrete paths:
  9 canonical + 7 aliases; the wildcard `*` excluded), the single list both
  `App.tsx` and the redirect logic agree on.
- `resolveHashRedirect(pathname, hash)`: returns `"/#" + cleaned path` when the
  URL is path-style (no hash), the path matches a known route, and it is not the
  root; returns `null` otherwise (hash present, root, unknown path, `/index.html`).
  Trailing slashes normalize; case stays significant.

`src/main.tsx` calls `resolveHashRedirect(window.location.pathname,
window.location.hash)` before `createRoot`; when it returns a target,
`window.location.replace(target)` reloads straight into the hash route
(render still proceeds so the module never dead-ends).

Tests:

- `src/utils/deepLinks.test.ts` — redirects for `/worship`, `/news-events`,
  aliases (`/donate`, `/mass-times`), trailing slash, query string survival;
  `null` for `/`, `/#/give` (hash present), unknown `/wp-admin`, case mismatch.
- Drift guard — parse `src/App.tsx` `path="…"` literals; every one (except `*`)
  must appear in `knownRoutePaths`, so the two tables cannot silently diverge.
- `e2e/deep-links.spec.ts` (Playwright, chromium) — `page.goto("/worship")` must
  land on the Worship page (`#/worship` in URL, Worship heading visible);
  `page.goto("/news-events")` must land on News & Events. Red before the fix
  (reproduced above), green after.

### F-5 — News & Events journey

The audit recommends adopting the sibling's pattern: "bulletin button in the
PageHero, optional per-event links, and a closing band routing to the bulletin
and Mass times." One **evidence-based adaptation**: Risen Christ links a stable
weekly bulletin (FlipHTML5). St Mary's real web presence publishes **no stable
weekly-bulletin URL** — verified 2026-08-31: `stmary.sg/bulletin`,
`/weekly-bulletin`, `/parish-bulletin` return 404; the parish's canonical
updates touchpoint is the **Parish Updates** page
(https://www.stmary.sg/parish-updates, HTTP 200) — itself surfaced in the audit
("St Mary's operates five active social channels … none surfaced at the point
where a parishioner is already looking for 'what's on'"). The fix therefore
routes the hero CTA and closing band to Parish Updates (+ Telegram, the parish's
official updates channel) instead of inventing a bulletin URL. Parity with the
sibling's *pattern* is preserved; the destination is the parish's real one.

Data (verified 200 on 2026-08-31, single source in `src/data/site.ts` / `src/data/content.ts`):

- `site.parishUpdates = "https://www.stmary.sg/parish-updates"`
- `EventItem.href` on two of the six events with real destinations:
  "World Youth Day 2027 briefing" → https://www.stmary.sg/wyd;
  "Franciscan Jubilee Year of St Francis" → https://www.stmary.sg/franciscanjubilee.
  The other four stay `href`-less — no invented URLs.

Page (`src/pages/NewsEvents.tsx`), mirroring the sibling's structure with SMA voice:

1. PageHero `children`: `<Button href={site.parishUpdates} variant="outline-light">Parish updates</Button>`.
2. Per-event conditional `Learn more` link (`link-underline`, `target="_blank"`,
   `rel="noopener noreferrer"`) only when `event.href` exists.
3. Closing dark band (`bg-shrine-maroon-950` + `bg-gold-bloom` + `bg-grain`):
   eyebrow "Never miss a week", SMA-voiced heading, buttons
   "Open parish updates" (outline-light → `site.parishUpdates`) and
   "Mass times" (ghost → `/worship#mass`; `#mass` anchor exists in `Worship.tsx:74`),
   plus a quiet Telegram link (`link-underline` on cream).

Contract preserved: event cards stay `card-tint` (the *card* still does not
navigate; only the explicit link does) — `card-affordance.test.tsx` (R6-01)
unchanged and still passing.

Tests (extend `src/pages/event-chips.test.tsx` scope with a new
`src/pages/news-events-journey.test.tsx`):

- Hero CTA link points at `site.parishUpdates` and opens in a new tab.
- Exactly 2 "Learn more" links render (the 2 events with `href`); each matches
  its event's destination; the 4 without `href` render none.
- Closing band: parish-updates link, internal `/worship#mass` link, and Telegram
  link all present with correct destinations.
- `site.test.ts` +1: `site.parishUpdates` is the verified stmary.sg URL.

## TDD runbook (each step red → green)

1. **R7-F1/F2**: write `src/test/wcag-contrast.test.ts` → run (red on 3 ratios)
   → add gold-700/terracotta-600 tokens + retone `categoryTone` + date `/85`
   → run (green) → full gate.
2. **R7-F3**: write `deepLinks.test.ts` + drift guard + `e2e/deep-links.spec.ts`
   → run (red: module missing / e2e lands Home) → implement `deepLinks.ts` +
   `main.tsx` wiring → run (green) → full gate + e2e.
3. **R7-F5**: write `news-events-journey.test.tsx` + `site.test.ts` case → run
   (red) → `site.ts`/`content.ts` data + `NewsEvents.tsx` composition → run
   (green) → full gate + e2e.

## Planned commits (all to `main`, no new branch)

1. `fix(a11y): AA-compliant event chip tones and date contrast (audit F-1, F-2)`
   — `src/index.css`, `src/components/EventMeta.tsx`, `src/test/wcag-contrast.test.ts`.
2. `fix(router): redirect path-style deep links to hash routes (audit F-3)`
   — `src/utils/deepLinks.ts`, `src/main.tsx`, `src/utils/deepLinks.test.ts`,
   `e2e/deep-links.spec.ts`.
3. `feat(news): complete the News & Events journey (audit F-5)`
   — `src/data/site.ts`, `src/data/content.ts`, `src/pages/NewsEvents.tsx`,
   `src/pages/news-events-journey.test.tsx`, `src/data/site.test.ts`.
4. `docs: round-7 remediation records, audit reference, doc alignment`
   — `docs/*`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `st-mary-of-angels_SKILL.md`.

## Gate after (target)

```
pnpm lint          0
pnpm typecheck     0
pnpm test          28+3 new spec files, 155 + all new assertions — all green
                    (exact totals recorded in docs/remediation-round7-2026-08-31.md)
pnpm build         dist/index.html single-file, size delta < +2 kB
pnpm test:e2e      42 + deep-links specs — all green
```

## Invariants preserved

- `HashRouter` retained — the documented zero-rewrite tradeoff stands; F-3 fix is
  additive and only redirects *known* path-style routes.
- No existing `shrine-*` token mutated — only new scale steps added.
- `card-tint` affordance contract (R6-01) intact — event cards remain non-lifting.
- No fabricated parish facts — every new URL verified HTTP 200 on 2026-08-31;
  events without verified destinations stay link-free.
- No test deleted, skipped, or weakened; assertion suites only grow.
- Sister-port findings (F-4, F-9) untouched — separate repository.

## Where to look next

- `src/components/EventMeta.tsx` — retone map + date step
- `src/utils/deepLinks.ts` — route table + redirect resolution
- `src/pages/NewsEvents.tsx` — hero CTA, per-event links, closing band
- `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md` — the source audit (markdown reference)
