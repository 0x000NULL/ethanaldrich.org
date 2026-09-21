import { PROFILE } from "@/data/profile";
import type { Station } from "@/data/subway/types";

/** Reads from PROFILE so the origin lives in one place. */
const SITE = PROFILE.site;

export interface Crumb {
  name: string;
  /** Path relative to the site root, e.g. "/blog". Omit for the current page. */
  path?: string;
}

/**
 * schema.org `BreadcrumbList`.
 *
 * The site has a genuine two-level hierarchy (home → blog → post, home →
 * station) that nothing expressed, so search results showed bare URLs with no
 * indication of where a page sat.
 *
 * The last crumb is the current page and deliberately carries no `item`:
 * Google's guidance is that the final element identifies the page itself.
 */
export function buildBreadcrumbJsonLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path !== undefined ? { item: `${SITE}${crumb.path}` } : {}),
    })),
  };
}

/**
 * schema.org `Article` for a station case study.
 *
 * These pages already declare `og:type: "article"` but shipped no structured
 * data at all, unlike blog posts. There is no reliable published date for a
 * station — `dates` is a human range like "Sep 2021 to Present" — so none is
 * claimed rather than inventing one.
 */
export function buildStationJsonLd(station: Station): Record<string, unknown> {
  const url = `${SITE}/station/${station.code}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: station.name,
    description: station.summary,
    author: { "@type": "Person", name: PROFILE.name, url: SITE },
    publisher: { "@type": "Person", name: PROFILE.name, url: SITE },
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(station.stack && station.stack.length > 0
      ? { keywords: station.stack.join(", ") }
      : {}),
  };
}
