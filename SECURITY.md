# Security Policy

This is a personal site, not a product, but it is public and it runs code, so
it gets a policy.

## Reporting a vulnerability

Email **ethan@ethanaldrich.org**, or open a
[private security advisory](https://github.com/0x000NULL/ethanaldrich.org/security/advisories/new)
on this repository. Please do not open a public issue for anything exploitable.

Include what you did, what happened, and what you expected. A proof of concept
helps; a working exploit is not required and is not expected.

I will acknowledge within 72 hours. Since this is a one-person project, a fix
may take longer than that, and I will say so rather than go quiet.

## Scope

In scope:

- `ethanaldrich.org` and the code in this repository
- the API routes under `src/app/api/`

Out of scope:

- findings that require physical access to my machines
- automated scanner output with no demonstrated impact
- missing headers with no exploitable consequence
- social engineering, and anything affecting third-party services this site
  merely links to

## What this repository already does

- Content Security Policy with no `'unsafe-eval'`, set in `next.config.ts`
- no runtime `eval`, and no dependency that requires it: the animation layer is
  hand-rolled `requestAnimationFrame` rather than a library
- user-supplied route parameters are sanitised before touching the filesystem
  (`src/lib/blog.ts`, `src/lib/stations.ts`), after a CWE-22 path traversal was
  found and fixed in `423f07f`
- rate limiting on the API routes (`src/lib/rate-limit.ts`). `getClientIp` reads
  the **rightmost** `X-Forwarded-For` hop, not the leftmost: everything to the
  left of the entry our own proxy appends is supplied by the caller, so reading
  `split(",")[0]` let anyone mint a fresh quota key per request. If the number
  of trusted proxies in front of this app ever changes, that index must change
  with it
- CodeQL static analysis (`.github/workflows/codeql.yml`) on every push and
  weekly, since advisories land between pushes
- Dependabot for npm and GitHub Actions, and `npm audit` enforced in CI at
  `--audit-level=high`
- the security headers are asserted in both the production and development
  branches (`src/__tests__/security-headers.test.ts`) and re-checked against a
  real built server in CI
- GPG-signed commits

## Dependency overrides

`package.json` pins two transitive dependencies. Neither is a downgrade for its
own sake:

- **`gray-matter` → `js-yaml@3.15.2`.** `3.15.2` is the patched 3.x. The pin is
  scoped to `gray-matter` rather than applied globally because `gray-matter`
  calls `yaml.safeLoad`, which was **removed** in js-yaml 4.x — a global pin
  would silently break frontmatter parsing, and forcing 4.x on it breaks it
  outright. ESLint keeps its own js-yaml 4 alongside.
- **`yaml@2.9.1`** — patched release, no API change.

## Known accepted risk

`vitest` is pinned at `4.0.18` rather than the patched `4.1.11`. The fixed
version pulls `@vitest/browser-playwright@5.0.1` into its peer set, and npm
11.3.0's Arborist crashes resolving it on any install. It is a devDependency,
it never reaches the deployed site, and the advisory requires the Vitest UI
server to be listening, which nothing in this project runs. This will move as
soon as npm can install it.
