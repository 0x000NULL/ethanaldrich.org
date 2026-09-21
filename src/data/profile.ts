/**
 * Single source of truth for who this site is about.
 *
 * The identity card, the intro splash, the server-rendered outline, the root
 * metadata, the JSON-LD `sameAs` block and the OG image all read from here, so
 * the name, title and links cannot drift apart across those six surfaces the way
 * they did when each one hardcoded its own copy.
 */

export const PROFILE = {
  name: "Ethan Aldrich",
  /** Security-led, matching the rebuilt resume's title line. */
  title: "Security, Infrastructure & Software Engineering",
  role: "Chief Technology Officer",
  location: "Las Vegas, NV",
  /** Plain-English, metaphor-free. This is the fallback for anyone who does not
   *  read the subway map as a subway map. */
  blurb:
    "Chief Technology Officer at Budget Rent a Car Las Vegas and Twelve Management. I run security operations, infrastructure and software for a 314-employee, eight-location business.",
  email: "ethan@ethanaldrich.org",
  site: "https://ethanaldrich.org",
  /** Split form of `location`, for schema.org PostalAddress. */
  city: "Las Vegas",
  region: "NV",
  country: "US",
} as const;

/**
 * How the metaphor is described in prose. Kept beside the blurb so the two
 * halves of the page description live together; `blurb` stays metaphor-free on
 * its own for surfaces that do not explain the map.
 */
export const METAPHOR =
  "A portfolio mapped as a Tokyo-Metro transit system — career, projects, and learning as subway lines.";

export interface Employer {
  /** Formal legal-ish name, for schema.org `worksFor`. */
  name: string;
  /** Short form used on the map and in running prose. */
  short: string;
}

/**
 * The two employers, named once.
 *
 * These previously appeared in four different phrasings across layout.tsx's
 * JSON-LD, its meta description, PROFILE.blurb, a station name and a train's
 * `nowServing` label, which is exactly the drift this module exists to stop.
 */
export const PROFILE_EMPLOYERS: Employer[] = [
  {
    name: "Malco Enterprises of Nevada (Budget Rent a Car Las Vegas)",
    short: "Budget Rent a Car Las Vegas",
  },
  { name: "Twelve Management", short: "Twelve Management" },
];

export interface ProfileLink {
  label: string;
  href: string;
  /** Leaves the site, so it needs target/rel and an external affordance. */
  external?: boolean;
}

export const PROFILE_LINKS: ProfileLink[] = [
  { label: "Résumé (PDF)", href: "/resume.pdf", external: true },
  { label: "GitHub", href: "https://github.com/0x000NULL", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ethan-aldrich",
    external: true,
  },
  { label: "Writing", href: "/blog" },
  { label: "Email", href: `mailto:${PROFILE.email}` },
];

/** The subset that belongs in schema.org `sameAs` (profiles Ethan controls). */
export const PROFILE_SAME_AS: string[] = [
  "https://github.com/0x000NULL",
  "https://www.linkedin.com/in/ethan-aldrich",
];
