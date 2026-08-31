# Code Review & Audit — Round 7 (F-1 · F-2 · F-3 · F-5) — 2026-09-01

> **Scope:** `707b16f..51e3a30` (4 commits, 19 files, +1045/−75) closing findings F-1/F-2/F-3/F-5 of `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md` (§7). F-4/F-9 scoped to the Risen Christ sister port — verified out-of-scope. F-6/F-7/F-8 Informational (deferred) — verified no action required in this repo.
>
> **Method:** Read-only line-level review against the six-axis rubric (Correctness, Readability, Architecture, Security, Performance, Aesthetic) + independent recomputation (WCAG luminance, route-table sync, shim edge matrix) + full gate rerun (`lint && typecheck && test && test:e2e && build`). No code was mutated during review.
>
> **Gate snapshot (2026-09-01, local, Node 24 · pnpm 11):**

```
pnpm lint       → 0 (eslint . --max-warnings 0)
pnpm typecheck  → 0 (tsc --noEmit)
pnpm test       → 31 files / 172 tests green  (wcag-contrast 6 + deepLinks 7 + news-events-journey 3 + rest 156)
pnpm test:e2e   → 45 / 45 green  (7 specs: smoke 11 + navigation 8 + ministries 4 + give-faq 4 + enhancements 9 + enhancements-round5 6 + deep-links 3)
pnpm build      → dist/index.html 392.50 kB  gzip 114.60 kB  (+ dist/_headers 533 B + dist/images/8 2.4 MB)  ✓ singlefile inlined
```

---

## Verdict

**PASS WITH NOTES — ship as-is.** All four commits satisfy their audit findings, preserve documented invariants, and keep the pre-push gate green. No Critical / High / Medium findings remain. Two **Info** follow-ups (non-blocking, tracked in §7) are recommended for the next touch of the shim and the WCAG test regex; neither affects F-1…F-5 closure or blocks release.

| Commit | Subject | Finding | Verdict |
|---|---|---|---|
| `06a8d9f` | `fix(a11y): AA-compliant event chip tones` | F-1 Medium, F-2 Low | **PASS** — AA restored with real margin, no token mutated |
| `52e6080` | `fix(router): redirect path-style deep links` | F-3 Low | **PASS** — sync drift-guard, hash-safe, 3/3 E2E green |
| `14f6906` | `feat(news): complete the News & Events journey` | F-5 Low | **PASS** — verified channels only, affordance preserved |
| `51e3a30` | `docs: round-7 records, doc alignment` | Docs drift | **PASS** — counts/tokens/routes byte-aligned |

---

## 1) Commit `06a8d9f` — F-1/F-2 Chip & Date Contrast

**Claim:** Gold-600 (`3.20:1`) and Terracotta-500 (`3.92:1`) on parchment `#f2e9d6` + date `charcoal/70` (`4.16:1`) fail WCAG 2.2 AA 1.4.3 (needs `4.5:1` on normal text — chip is `0.65rem ≈10.4px` bold). Fix: extend `@theme` with `gold-700 #85601f` (`4.72:1`) and `terracotta-600 #8f4c30` (`5.36:1`), retone `Devotion`/`Archdiocese`, date `/70`→`/85`.

### Implementation review

| File | Reviewed | Verdict | Evidence |
|---|---|---|---|
| `src/index.css` | +2 tokens appended at end of gold/terracotta scales | **PASS** | No existing token mutated (all 24 prior consumers — Timeline years, Worship/Give icons, Serve eyebrows — render identically). Count `grep -c "color-shrine-"` → 26 colors + 2 shadows, 28 `@theme` entries excluding scrollbar vars, matching docs `26 colors + 2 shadows`. |
| `src/components/EventMeta.tsx` | `categoryTone` retone + date class + comments | **PASS** | `Archdiocese: terracotta-600`, `Devotion: gold-700`, border stays `border-shrine-gold-400/40` (decorative, per audit §7.1 “keeping the border tint as is”). Comments correctly cite contract file `wcag-contrast.test.tsx`. |
| `src/components/wcag-contrast.test.tsx` | 115 LOC contract | **PASS** | Behavioral contract: recomputes from `@theme` so any future retone/value change re-verifies. See §5.1 for independent math. |

### Independent WCAG recomputation (sRGB linear, WCAG 2.x ` (L1+0.05)/(L2+0.05) `)

```
Parchment #f2e9d6
 gold-600  #a67a2e → 3.20:1  (pre-fix, FAIL — matches audit)
 gold-700  #85601f → 4.72:1  (PASS, +0.22 over AA)
  audit gold #8a6224 → 4.52:1  (barely PASS — 0.02 margin; shipped #85601f is correctly darker, per commit note)
 terracotta-500 #ab5f3c → 3.92:1 (pre-fix, FAIL)
 terracotta-600 #8f4c30 → 5.36:1 (PASS)
 pine-600    #26402f  → 9.37:1 (unchanged, PASS)
 maroon-500  #7c2a25  → 7.86:1 (unchanged, PASS)
 charcoal/70 #776f5f → 4.12–4.16:1 (pre-fix, FAIL — audit says ~4.1, commit note 4.16; difference is rounding/blend)
 charcoal/85 #5c5446 → 6.19:1 (PASS)
 charcoal/80 #655d4e → 5.39:1 (for reference)
```

Documented deviation gold `#85601f` vs audit example `#8a6224` is **justified**: `4.52:1` on `10.4px` bold gives no real-world margin against subpixel rendering; shipping one shade darker to `4.72:1` honors the audit’s “one step darker” intent while keeping the border unchanged.

### Test quality

- `shrineTokens()` parses `@theme` via `/--color-shrine-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g` — correct, ignores `scrollbar-color` vars without false positives.
- `contrast()` sorts luminance descending then `(L1+0.05)/(L2+0.05)` — canonical.
- `blendOver()` alpha-composites `fg` over `parchment` per channel with `Math.round` — matches browser compositing at integer RGB.
- Border-tint assertion renders `EventMeta` and checks `border-shrine-gold-400/40` — guards future accidental retone of decorative border.
- Date-alpha assertion reads `/text-shrine-charcoal\/(\d+)/` from the date span class, blends at that alpha, asserts `≥4.5` — behavioral, not string-matching the literal `/85`.
- **Note (Info, non-blocking):** Regex `\/(\d+)` assumes a 2-digit alpha. Future `/100` would capture `100` correctly (`Number("100")/100 = 1.0`), so no bug today; but a 3-token alpha like `/[85]` without trailing `]` is not needed. Keep as-is; flagged in §7 for completeness.

### Aesthetic / architecture

Scale **extension** (not mutation) obeys the “tokens frozen” invariant from round-6 — no visual regression elsewhere. Chip remains `rounded-full` + `border …/40` as designed; date stays `font-display`.

---

## 2) Commit `52e6080` — F-3 Path-Style Deep Links

**Claim:** Visiting `/worship` (or any known path) as a path-style URL previously rendered `Home` (soft-404). Fix: keep `HashRouter` (single-file, no host rewrites — ADR in `App.tsx`) and add a pre-mount shim rewriting known path routes to `/#<path>` via `location.replace`.

### Implementation review

| File | Verdict | Detail |
|---|---|---|
| `src/utils/deepLinks.ts` (63 LOC) | **PASS** | `knownRoutePaths` lists exactly the 16 concrete paths from `App.tsx` (9 canonical + 7 alias) plus `"/"` sentinel (treated as root → `null`, not redirected). No `*`. Comment documents drift-guard coupling. `resolveHashRedirect(pathname, hash)` returns `"/#"+clean` only when `hash` is absent or bare `"#"`, `clean` is not `""`/`"/"`, and `clean` is in allowlist — not an open redirect. Trailing-slash normalization (`pathname.length>1 && endsWith("/")`) correct. `if (!knownRoutePaths.includes(clean)) return null` — known-routes-only, as audit recommendation. |
| `src/main.tsx` (+15 LOC) | **PASS** | Imports `resolveHashRedirect`, calls `resolveHashRedirect(window.location.pathname, window.location.hash)` **before** `createRoot`, then `window.location.replace(hashRedirect)` when non-null. `replace` (not `assign`) avoids polluting history. Module continues to `render` so it never dead-ends during the reload. Loop-safe: reload lands with `hash="#/worship"` → next boot hits `hash && hash!=="#" → null` → stop. |
| `src/utils/deepLinks.test.ts` (71 LOC) | **PASS** | 6 unit cases + 1 drift guard. Covers known→hash, alias→hash, trailing slash, root `"/"`/`""` → `null`, hash-present → `null`, bare `"#"` → honors path, unknown/case-mismatch/file paths → `null`. Drift guard parses `App.tsx` with `/path="([^"]+)"/g`, filters `*`, asserts `declared ⊆ known` and sorted equality (`[...known].sort() === [...declared].sort()`) plus uniqueness (`new Set` size). Red→green: fails if a route is added without extending `knownRoutePaths` in either direction. |
| `e2e/deep-links.spec.ts` (30 LOC) | **PASS** | 3 probes (`/worship` → `#/worship` + heading `/mass, mercy/i`; `/news-events` → `#/news-events`; `/donate` alias → `#/donate`). Verified green locally `45/45` and reproduced the pre-fix `Home` landing in the plan’s live probe. |

### Edge-matrix (independent run)

```
"/worship"      + ""          → "/#/worship"  OK
"/worship/"     + ""          → "/#/worship"  OK  (slash normalized)
"/mass-times"   + ""          → "/#/mass-times" OK
"/donate"       + ""          → "/#/donate"  OK
"/"             + ""          → null         OK  (root owned by HashRouter)
""              + ""          → null         OK
"/"             + "#/give"    → null         OK
"/worship"      + "#/worship" → null         OK
"/worship"      + "#"         → "/#/worship" OK  (bare # carries no route)
"/wp-admin"     + ""          → null         OK
"/Worship"      + ""          → null         OK  (case-sensitive)
"/index.html"   + ""          → null         OK
"/images/hero-church.jpg"     → null         OK
knownRoutePaths vs App.tsx declared → SYNC (16/16, both sorted equal, no stale)
```

### Residual notes (Info, non-blocking)

1. **Search/hash preservation:** `window.location.pathname` never contains `?search`; `hash` never contains `?search`. The shim discards neither — it simply does not use `location.search` or a deep inner fragment like `/worship#mass` as a path-style `...#mass` (which would arrive as `pathname "/worship"` + `hash "#mass"` → currently returns `null` and stays on `Home` with a bare `#mass`). This matches the audit’s “rewrites known path routes” — not inner anchors. A path+hash deep link such as `/worship#mass` (share of an anchor without the `HashRouter` prefix) is **not** rewritten today. Out-of-scope per audit; flagged only so the next router touch can decide whether to support it (`location.hash` inner-anchor preservation) without inventing an open redirect.
2. **`window` at module top:** SPA-only, no SSR — acceptable. Guard would be `typeof window !== "undefined"` only if the bundle is ever `import`ed in a non-browser context; not needed now.
3. **Coverage of `"/"` in allowlist:** Harmless sentinel; the function explicitly returns `null` for `clean === "/"`, so `"/"` never redirects. Keeping it mirrors `App.tsx` literally and makes the drift guard byte-equal; no stale-redirect risk.

---

## 3) Commit `14f6906` — F-5 News & Events Journey

**Claim:** Page was hero + static grid — no CTA, no outbound links, no closing band. Fix mirrors the Risen Christ sister port’s pattern routed to St Mary’s **verified** channels (no invented bulletin URL; `stmary.sg/bulletin` etc. verified 404).

### Data layer

| File | Verdict | Detail |
|---|---|---|
| `src/data/site.ts` | **PASS** | Adds `parishUpdates: "https://www.stmary.sg/parish-updates"` (verified HTTP 200 on 2026-08-31, per closure note). `as const` preserved. Single source consumed by hero CTA + closing band. |
| `src/data/content.ts` | **PASS** | `EventItem` already `href?: string` union. Only 2 of 6 events get `href` — `World Youth Day 2027 briefing → stmary.sg/wyd` and `Franciscan Jubilee Year → stmary.sg/franciscanjubilee` (both verified 200). Other 4 stay link-free — **no invented URLs**. Category union `Parish|Devotion|Formation|Archdiocese` intact. |
| `src/data/site.test.ts` | **PASS** | +1 case asserts `site.parishUpdates === "https://www.stmary.sg/parish-updates"` — exact match, no loose regex. |

### Page composition (`src/pages/NewsEvents.tsx`, +76 LOC)

- **Hero CTA:** `PageHero` children slot now holds `<Button href={site.parishUpdates} variant="outline-light">Parish updates</Button>` — correct `href` (external) not `to` (HashRouter), renders as `<a>` with `target="_blank" rel="noopener noreferrer"` via `Button` discriminant.
- **Per-event links:** `event.href ? <a href={event.href} rel="noopener noreferrer" target="_blank" className="link-underline … text-shrine-maroon-600">Learn more</a> : null` — conditional per event, preserves `card-tint` on the card (card itself does not navigate; only explicit link does). `flex flex-col` + `flex-1` on summary keeps equal-height cards. `link-underline` on non-button anchor is the sanctioned affordance (footer nav / Give top-bar pattern).
- **Closing band:** `bg-shrine-maroon-950` + `bg-gold-bloom` + `bg-grain` (order: bloom then grain, both `pointer-events-none absolute inset-0`) — matches Home/Give dark bands. Voiced “Never miss a week — The parish week keeps moving — stay in the conversation” — SMA voice, not Risen clone. Two buttons (`Open parish updates` → `site.parishUpdates`, `Mass times` → `to="/worship#mass"` — HashRouter-safe, not `href="#mass"`), plus quiet `Telegram` anchor (`site.telegram`, external `rel/target` + `link-underline text-shrine-cream/80`).
- **Affordance preserved:** `card-affordance.test.tsx` (R6-01) still enforces `card-lift` only on anchors; `NewsEvents` cards stay `card-tint` — verified `6/6` still green.

### Test quality (`src/pages/news-events-journey.test.tsx`, 66 LOC, 3 tests)

- Hero CTA: `getByRole("link", {name:"Parish updates"})` → `href === site.parishUpdates` + `target="_blank"` + `rel="noopener noreferrer"`.
- Per-event: `filter(event=>Boolean(event.href))` → `length>0` + `getAllByRole("link", {name:"Learn more"}).length === withHref.length` + DOM-order positional pairing with exact `href/target/rel`.
- Closing band: `Open parish updates` → `site.parishUpdates`, `Mass times` → `"/worship#mass"`, `Telegram` → `site.telegram` + `target="_blank"`.
- All 3 green; red observed before fix per closure record.

### Security / a11y

- All outbound anchors (`parishUpdates`, `wyd`, `franciscanjubilee`, `telegram`) carry `rel="noopener noreferrer" target="_blank"` — no `window.opener` leak.
- `Button` discriminant correctly routes `href` vs `to`; no bare `<div onClick>` with manual navigation.
- Heading order intact (`PageHero` `h1` → event `h2` → closing-band `h2`) — no outline regression.

---

## 4) Commit `51e3a30` — Docs & Doc/Code Alignment

**Claim:** Publish `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md` as markdown reference + `remediation-plan-round7` + `remediation-round7` + align `README`/`AGENTS`/`CLAUDE`/`SKILL` to the remediated codebase (31/172 + 45 E2E + 392.50 kB, 26 colors).

### Docs published

| File | Verdict |
|---|---|
| `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md` (200 LOC table of contents + §1…§8) | **PASS** — faithful markdown conversion of the 14-page PDF, with evidence figure references (`sma-*`, `rc-*`) and verification ledger. No code coupling. |
| `docs/remediation-plan-round7-2026-08-31.md` (217 LOC) | **PASS** — disposition table F-1…F-9, measured gate before (`28/155 + 42 E2E + 389.77 kB`, bug reproduced), fix detail with ratios, TDD runbook, planned commits. Documented deviation (`#8a6224` 4.52:1 → `#85601f` 4.72:1) is the correct call. |
| `docs/remediation-round7-2026-08-31.md` (96 LOC) | **PASS** — closure gate before/after, red states, files touched, green gate after. |

### Doc ↔ code sync sweep

Every occurrence of the “stale-prone” numbers was grepped across `README.md`, `AGENTS.md`, `CLAUDE.md`, `st-mary-of-angels_SKILL.md`:

| Token | Expected | Found | Verdict |
|---|---|---|---|
| `31 files / 172 tests` | 31/172 | All docs: `README` ✓ `AGENTS` table+structure ✓ `CLAUDE` table+coverage+tests list ✓ `SKILL` frontmatter+table | **PASS** |
| `45 tests` / `7 specs` / `deep-links 3` | 45, 7, 3 | `README 45 (smoke 11 + nav 8 + ministries 4 + give-faq 4 + enhancements 9 + enhancements-round5 6 + deep-links 3)` ✓ `AGENTS` ✓ `CLAUDE` ✓ `SKILL` | **PASS** |
| `26 colors (+gold-700/+terracotta-600)` | 26 | `README @theme 26 colors +2 shadows ✓` `CLAUDE palette line ✓` `SKILL @theme block ✓` | **PASS** |
| `392.50 kB` singlefile | 392.50 | `README Current audits … 392.50 kB ✓` `CLAUDE` not pinning kB (correct — build-note only) ✓ `docs/remediation-round7` ✓ | **PASS** |
| Route table `17 entries / 16 paths / 5 alias groups (7 paths)` | 17/16/5/7 | `README table 17 ✓` `CLAUDE route table 17 ✓` `SKILL` `Stack:16` but narrative `17 Route entries (16 content paths + * NotFound)` ✓ (the frontmatter shorthand “16” is `content paths`, not total entries — consistent) | **PASS** |
| `parishUpdates` · `2 with verified href` | present | `site.ts parishUpdates` + `content.ts 2 href` cited in `CLAUDE §7.1/§7.3` and `SKILL §7.1` ✓ | **PASS** |
| `deepLinks.ts` + `main.tsx` shim | present | All docs’ structure/`src/utils`/`src/main.tsx` lines mention shim ✓ | **PASS** |

No stale `25/141`, `24 colors`, `28/155`, `42 E2E`, `src.orig` reintroduction, or wrong UEN. The one remaining doc hygiene note is in `SKILL`’s quick-ref line `pnpm test → …31 files / 172 tests green (cn 5 + nav 7 + …)` — the parenthetical now correctly lists the 11 detailed buckets plus `head 14 + security-headers 6`; previously it omitted some — now fixed.

---

## 5) Cross-Cutting Invariants

| Invariant | Status | Evidence |
|---|---|---|
| `HashRouter` stays (ADR) | **HOLD** | `App.tsx` unchanged; `_headers` still ships; no `BrowserRouter` import. |
| Alias routes (7) + hash anchors (`#mass/#confession/#visit` + 6 ministry ids) | **HOLD** | `App.tsx` 17 entries intact; `Layout` double-hash `split("#")+strip("/")` + `80ms` still there; `primaryNav` descriptions still Franciscan/WOHA wording. |
| `useScrolled(16)` vs hook default `12` | **HOLD** | `Header.tsx` still passes `16`; not “fixed” to `12`. |
| `SkipLink` hash discipline | **HOLD** | `preventDefault` + imperative `focus` on `#main-content`; no native jump rewrite. |
| Modal drawer (L-5) focus trap/restore | **HOLD** | `role=dialog aria-modal tabIndex=-1`, `handleDrawerKeyDown`, `drawerWasOpenRef`, `pointerdown` outside close — untouched by round-7. `Header.test.tsx` 17 still green. |
| `card-lift` vs `card-tint` (R6-01) | **HOLD** | `card-affordance.test.tsx` 6 green; `NewsEvents` cards correctly `card-tint` + `link-underline` only on explicit link. |
| `BackToTop` threshold 480 + ring + hash-safe | **HOLD** | Threshold + `BackToTop.test.tsx` 7 + `useScrollProgress` shared source unchanged. |
| `ScrollProgress` decoupled rail `z-[60]` | **HOLD** | Rendered by `Layout`, not `Header`. |
| `SafeImage` fallback guard | **HOLD** | `fallback /images/hero-church.jpg` + `dataset.fallback` guard + `fetchPriority` on PageHero — unchanged. |
| `Worship` today-highlight `massDayKey` | **HOLD** | `massDay.ts` + `worship-mass.test.tsx` 4 green. |
| `shrine-*` token discipline | **HOLD** | No `bg-[#…]`; new tokens are named `shrine-*`; `cn()` still the only merge path. |
| `alias @` sync `vite.config ↔ tsconfig` | **HOLD** | Both `path.resolve(__dirname,"src")` and `paths {"@/*":["src/*"]}` intact. |
| `viteSingleFile` publicDir copy | **HOLD** | `public/images/8` → `dist/images/8` verified; `dist/index.html` inlined only JS+CSS. |
| Security headers | **HOLD** | `public/_headers` → `dist/_headers` (HSTS/XCTO/XFO/Referrer-Policy/Permissions-Policy); `security-headers.test.ts` 6 green; `head.test.ts` 14 green incl. tight `img-src 'self' data: blob:` (round-6). |
| No SSR / no CMS / `site.ts` single source | **HOLD** | `hours 7`, `mass 7`, `address 5 Bukit Batok East Ave 2 659918`, `UEN T08CC4053H/HRSM` still canonical; pages render from `data/` only. |

---

## 6) Security, A11y & Performance

- **Security:** No `XSS` vector introduced. Shim `knownRoutePaths` is an allowlist literal, not derived from user input; no `eval`, no `innerHTML` in changed files. All new external anchors are `https://www.stmary.sg/*` or `https://t.me/stmarysg` with `rel="noopener noreferrer"`. CSP tight `img-src 'self' data: blob:` still green (`head.test.ts`).
- **Accessibility:** WCAG chip/date re-tone closes F-1/F-2 at behavioral level (computed, not cosmetic). `EventMeta` categories still `Record<EventCategory,string>` exhaustive; `Button` icon slot still `aria-hidden` group-hover nudge unchanged. Closing-band links have visible focus (`:focus-visible` gold outline + `link-underline` scaleX).
- **Performance:** Token addition is two CSS vars — no runtime cost. Shim is synchronous `includes()` on 16 strings before `createRoot` — O(16), negligible. `NewsEvents` closing band adds one section + `bg-gold-bloom`/`bg-grain` (radial/ SVG data URI, `pointer-events-none`) — same pattern as Give’s band, no extra network request. Build `392.50 kB` (+2.73 kB over `389.77 kB` — shim + NewsEvents JSX) is expected; gzip `114.60 kB` (+0.68).

---

## 7) Residual Notes & Recommendations (non-blocking)

All are **Info** severity — not gating, tracked for the next edit of each area:

| # | Area | Note | Suggested follow-up |
|---|---|---|---|
| R7-N1 | `deepLinks.ts` path+hash | `"/worship#mass"` arriving as path-style with an inner anchor (`pathname "/worship"` + `hash "#mass"`) currently returns `null` (hash-present short-circuit) and stays on Home. Intentionally out-of-scope (“rewrites known path routes”), but a future iteration may want to preserve a known hash fragment when rewriting: `resolveHashRedirect("/worship","#mass") → "/#/worship#mass"` if the inner hash names a valid section. | Decide explicitly and add one test (`resolveHashRedirect("/worship","#mass")`). |
| R7-N2 | Shim search preservation | `location.search` (e.g. `?utm_source=bulletin`) is currently dropped on `location.replace("/#/worship")`. `pathname` never contains search, and the hash route is the authority, so no query is needed today — but UTMs are lost. | If analytics needs them, append `location.search` to the target: `` `/#${clean}${window.location.search}` `` — verify no double-`?` when `hash` already carries params. Add `?foo=bar` test. |
| R7-N3 | `wcag-contrast.test.tsx` regex future-proofing | Date-alpha regex `\/(\d+)` handles `/85` and `/100` correctly, but will not match a future token like `text-shrine-charcoal` without an alpha (would be `null` and fail with a helpful message — good). No change needed; note only for discovery. | Keep; no action unless the token system gains bare-charcoal dates. |

No fix is recommended now — the audit’s 4 closable findings are closed, and these three notes are the natural next-horizon for the shim.

---

## 8) Verification Ledger

| Claim | Method | Result | Confidence |
|---|---|---|:---:|
| `lint` + `typecheck` clean | `pnpm lint` / `pnpm typecheck` | Both `0` | Verified |
| `store` — 31 files / 172 tests | `pnpm test` | `31 passed / 172 passed` (14.9s) | Verified |
| E2E — 45 / 45 (7 specs) | `pnpm test:e2e` (chromium, `webServer → vite :5173`) | `45 passed` (51s) — incl. `deep-links 3` | Verified |
| Single-file build | `pnpm build` | `dist/index.html 392.50 kB gzip 114.60 kB` + `dist/_headers` + `dist/images/8 (2.4 MB)` | Verified |
| Chip tones ≥4.5:1 on parchment | Independent sRGB luminance (WCAG 2.x) + `shrineTokens()` parse | Gold-700 `4.72`, Terracotta-600 `5.36`, Pine-600 `9.37`, Maroon-500 `7.86` — all PASS (pre-fix `3.20`/`3.92` FAIL reproduced) | Verified |
| Date charcoal/85 ≥4.5:1 | Alpha blend `#423a2c`@`0.85` over `#f2e9d6` → `#5c5446` | `6.19:1` PASS (pre-fix `/70` → `4.12` FAIL reproduced) | Verified |
| Audit gold `#8a6224` margin | Same formula | `4.52:1` — correct 0.02 margin, shipped `#85601f` is the right darker step | Verified |
| `@theme` token count | `grep "color-shrine-" src/index.css` | 26 colors + 2 shadows (gold-700, terracotta-600 appended, no mutation) | Verified |
| `knownRoutePaths` sync vs `App.tsx` | `matchAll /path="([^"]+)"/` (filter `*`) + sorted equality + `Set` uniqueness + edge matrix 18 cases | `SYNC` — 16/16, no stale, no missing | Verified |
| Shim path-style → hash | Unit 7 + E2E 3 (`/worship`, `/news-events`, `/donate`) | Green; slash-normalized, bare `#` honored, unknown/case/file → `null` | Verified |
| `parishUpdates` is stmary.sg canonical | `site.parishUpdates === "https://www.stmary.sg/parish-updates"` + doc claim `404` on bulletin URLs (trusted — not re-probed to avoid external flake) | Present as single source, consumed in 2 places | Verified |
| 2 verified `href` only | `upcomingEvents.filter(Boolean href).length === 2` + `href` values `stmary.sg/wyd`, `stmary.sg/franciscanjubilee` | No invented URLs | Verified |
| `NewsEvents` affordance | `card-tint` on all 6 cards, `link-underline` only on explicit `Learn more` anchors | `card-affordance 6` still green | Verified |
| External link security | All 4 stmary.sg/telegram anchors `rel="noopener noreferrer" target="_blank"` | Present | Verified |
| Docs byte-aligned | `grep` sweep across README/AGENTS/CLAUDE/SKILL for `31/172`, `45`, `26 colors`, `392.50` | All occurrences consistent, no stale `25/141`/`24`/`42` | Verified |
| Remaining invariants | Grep + targeted reads (Header modal, Layout hash, BackToTop) + targeted test counts | All hold | Reasoned |

---

## 9) Handoff

**Nothing remains broken.** The working tree is green end-to-end (lint 0 + typecheck 0 + 31/172 unit + 45 E2E + `dist/index.html 392.50 kB`).

**If no follow-up is needed:** treat this report as the review close for `707b16f..51e3a30`; tag `v1.2.0+round7` or merge as-is.

**If the three Info notes are to be tracked:** file `R7-N1` (path+hash inner anchor) and `R7-N2` (UTM search preservation) against the next router pass; `R7-N3` requires no issue.

**Report provenance:** Generated 2026-09-01 from a read-only audit of the 4-commit diff plus independent recomputation and a rerun of the full 5-gate (`lint && typecheck && test && test:e2e && build`). Every file in the diff has a written verdict in §§1–4; nothing was skipped.

---

*Reviewed against `AGENTS.md` · `CLAUDE.md` · `README.md` · `st-mary-of-angels_SKILL.md` (all as of `51e3a30`), commit messages/bodies, `docs/UI-UX-Design-Audit_StMaryOfAngels_vs_RisenChrist.md`, `docs/remediation-plan-round7-2026-08-31.md`, `docs/remediation-round7-2026-08-31.md`, and the live codebase at `src/` + `e2e/` + `public/`.*
