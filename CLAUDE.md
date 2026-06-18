# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server at localhost:3000
npm run build         # Production build (next build)
npm run start         # Start production server (next start -p ${PORT:-3000})
npm run lint          # Run ESLint

# Testing
npm run test          # Vitest in watch mode
npm run test:run      # Single Vitest run
npm run test:coverage # Coverage report (90% global gate)
npm run test:e2e      # Playwright E2E
npm run test:e2e:ui   # Playwright UI mode
```

## Architecture

Personal portfolio rendered as an interactive **Tokyo-Metro-style subway map**. Education, career, projects, and side interests are transit **lines**; milestones/case studies are **stations**; animated **trains** show "now serving" status; **service alerts** are announcements. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Zustand 5. (It was rebuilt from a retro-BIOS desktop metaphor — all legacy BIOS code is gone.)

The codebase is layered, lowest to highest: **data → pure geometry/logic → SVG render → interaction → living simulation**. The lower layers are DOM-free and fully unit-tested; React components consume them.

### 1. Data — single source of truth (`src/data/subway/`)

Immutable config arrays re-exported through `index.ts`. **Render code never hard-codes a station** — it iterates config.

- `lines.ts` — `LINES` (4 active: **E** Education cyan, **C** Career red/express, **P** Projects magenta, **W** Weekend gray/dashed) and `TRANSFERS` (3 peanut interchanges; C-02↔P-09 "Fimil" is the marquee).
- `stations.ts` — `STATIONS` (21). Status is `operational` | `in-progress` | `planned`. Optional per-station `labelSide` (`above`|`below`|`right`) and `labelBand` (`near`|`far`) override label placement to dodge branches/peanuts. Other optional fields: `dates`, `stack`, `links`, `relatedPosts`, `hasBody`.
- `trains.ts` — `TRAINS` (3): which line, from/to station, `nowServing` label, `eta`, `express?`.
- `alerts.ts` — `ALERTS` (service announcements; `dismissible` flag).
- `types.ts` — `LineCode` (`E|C|P|W`), `StationStatus`, `Station`, `Line`, `Transfer`, `Train`, `ServiceAlert`, `NetworkConfig`.
- `index.ts` — helpers: `getNetwork`, `getStation`, `getLine`, `getStationsForLine`, `resolveLinePolylines`, `getTrunkPolyline`, `getNetworkBounds`, plus `STATION_MAP`/`LINE_MAP`, and the validation gate **`validateConfig()` / `assertValidConfig()`**.

**`validateConfig()` (the layout gate) checks:** (1) every trunk + branch segment is octolinear (0/45/90°); (2) referential integrity of transfers/trains/alerts; (3) no two stations share grid coords; (4) transfer "peanut" spacing `0 < d ≤ 3` grid units; (5) no roundel collisions (`< GRID*0.9` px). It runs as a test in `src/data/subway/index.test.ts` — **author station coordinates so this passes before touching render code.**

### 2. Pure geometry & logic (`src/lib/subway/`) — NO DOM

> **Hard rule:** never call SVG `getPointAtLength`/`getTotalLength`. jsdom doesn't implement them and they'd break the coverage gate. All path math is pure TS over authored coordinates, so the rendered `<path d>` and the train animation derive from the **same** polyline and can't drift.

- `geometry.ts` — `GRID = 52` (px per integer grid unit). Octolinear predicates (`octolinearDir`, `isOctolinear`, `snapToOctolinear`), `buildLinePath`, `measurePolyline`, `poseAtDistance`/`poseAt`, `detectLabelCollisions`, `easeInOutCubic`.
- `viewport.ts` — pan/zoom transform `Viewport {x,y,k}` where screen `s = u*k + {x,y}`. `fitToBounds`, `zoomAt`, `clampViewport`, `screenToUser`/`userToScreen`, `zoomToLine`/`zoomToStation`. `MIN_K=0.25`, `MAX_K=4`.
- `train.ts` — pure reducer `advanceTrain(state, ctx, dtMs)` (handles dwell + end-of-line reversal) and `trainPose`.
- `selectors.ts` — derived state: `getViewBox()` (asymmetric `VIEWBOX_PAD` keeps content clear of the corner overlays), `getLinePolylines` (memoized), `lineBounds`, `transfersForStation`, `focusedLineCodes`, `buildTrainRuntimes`. `BASE_SPEED=0.05` px/ms, express ×1.6, `DWELL_MS=900`.

### 3. Render layer (`src/components/subway/`, 15 components)

`SubwayShell` (client shell: hydration gate, init, deep-link sync, stats) → `SubwayMap` (the `<svg>`, `role="img"`, pan/zoom) which renders `LineLayer`→`Line`, `TrainLayer`→`Train`, `StationLayer`→`Station`/`Interchange`. Overlays: `StationIndex` (legend), `StationPanel` (case-study dialog), `ServiceAlertBanner`, `DepartureBoard` (recent posts), `RecenterButton`, and `A11yMapOutline` (screen-reader/keyboard nav).

### 4. Interaction (`src/hooks/`)

`useSubwayPanZoom` (drag-pan/wheel-zoom; captures only past a 4px drag threshold so clicks reach stations, and suppresses the click after a pan), `useTrainAnimation` (rAF loop via `performance.now()`, honors reduced-motion), `useRovingStations` (arrow-key roving tabindex), `useFocusTrap` (panel dialog), `useIsMobile`.

### State — `src/store/nav-store.ts` (Zustand, no persist middleware)

`theme`, `selectedStationCode`, `hoveredStationCode`, `panelOpen`, `viewMode`, `transform`, `reducedMotion`, `introSeen`, `dismissedAlerts`. Reducers are pure; storage is managed manually with `aldrich-*` keys (`aldrich-theme`, `aldrich-subway-intro-seen`, `aldrich-subway-dismissed-alerts`).

### Theme — `src/lib/themes.ts`

Single `metro` variant. `applyTheme()` writes 7 `--metro-*` CSS vars to `:root` + the `theme-color` meta tag. Components use CSS vars (`var(--metro-ink)`, line colors `var(--line-e|c|p|w)`) — **avoid hardcoded hex** so they respond to the theme.

### Blog / MDX & SEO

- `src/lib/blog.ts` reads `src/content/blog/*.mdx` via `gray-matter` (`getBlogPosts`, `getBlogPost`, `getAllBlogSlugs`).
- `src/lib/mdxComponents.tsx` — shared styled MDX renderers, used by both blog posts and station case studies.
- SSG routes give every post and station a crawlable page: `src/app/blog/[slug]/page.tsx` and `src/app/station/[code]/page.tsx` (both `generateStaticParams` + `generateMetadata`); `sitemap.ts` lists home + all posts + all stations.

### API routes (`src/app/api/`)

- `blog` / `blog/[slug]` — list / single post (slug-validated, MDX serialized).
- `stats` — GET/POST visitor stats (rate-limited 5/min, retry, persisted to gitignored `data/stats.json`).
- `contact` — POST contact form (rate-limited 3/hr, validated, sent via **Resend**; needs `RESEND_API_KEY`).
- `src/lib/rate-limit.ts` is the shared limiter (`checkRateLimit`, `getClientIp`).

## Conventions

- **Octolinear only** (0/45/90°), enforced by `validateConfig`; place stations on integer `GRID=52` coordinates.
- **Pure logic stays DOM-free and SSR-deterministic** (no `getPointAtLength`; config-derived viewBox).
- **Config is the single source of truth**; add a station/line/train by editing `src/data/subway/*`, not components.
- **Reduced motion respected end-to-end** (store flag → `TrainLayer` → `useTrainAnimation`).
- **Accessibility-first:** line letters on roundels (colorblind aid), focus-trapped dialogs, the sr-only `A11yMapOutline` mirrors the visual map.
- Path alias `@/*` → `./src/*`.
- **Security hardening:** CSP locked to `'self'` with **no `'unsafe-eval'`**; no `framer-motion`/`expr-eval` (animation is hand-rolled rAF).

## Testing

- **Unit:** Vitest + React Testing Library + MSW (`src/__tests__/mocks/`), jsdom env. Setup (`src/__tests__/setup.ts`) mocks storage/matchMedia/rAF/observers and adds defensive `getPointAtLength`/`getTotalLength` stubs; it is node-safe (guards `window`) so `// @vitest-environment node` SSR tests work.
- **Coverage gate: 90%** global (branches/functions/lines/statements). Excluded: test files, `src/__tests__/**`, `layout.tsx`, `opengraph-image.tsx`, and `src/app/**/page.tsx` (thin RSC composition + server-only MDX, validated by the build/e2e instead). Keep logic in the pure modules (≈100% coverable) and components thin.
- **E2E:** Playwright across Chromium/Firefox/WebKit + mobile. **`e2e/` is currently empty** — the old BIOS specs were deleted and new subway specs are not yet written, so `test:e2e` finds nothing until they're added.

## Deployment

DigitalOcean App Platform (`.do/app.yaml`): builds `npm run build`, runs `npm run start` on port 3000, auto-deploys `main`, region sfo, domains `ethanaldrich.org` + `www`. CI (`.github/workflows/test.yml`, Node 20): unit+coverage→Codecov, e2e (Chromium), lint, build. `next.config.ts` sets the security headers/CSP and wires MDX page extensions.
