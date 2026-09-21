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
- rate limiting on the API routes (`src/lib/rate-limit.ts`)
- Dependabot for npm and GitHub Actions, and `npm audit` enforced in CI at
  `--audit-level=high`
- GPG-signed commits

## Known accepted risk

`vitest` is pinned at `4.0.18` rather than the patched `4.1.11`. The fixed
version pulls `@vitest/browser-playwright@5.0.1` into its peer set, and npm
11.3.0's Arborist crashes resolving it on any install. It is a devDependency,
it never reaches the deployed site, and the advisory requires the Vitest UI
server to be listening, which nothing in this project runs. This will move as
soon as npm can install it.
