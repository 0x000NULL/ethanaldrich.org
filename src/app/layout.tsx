import type { Metadata } from "next";
import "./globals.css";
import {
  PROFILE,
  PROFILE_SAME_AS,
  PROFILE_EMPLOYERS,
  METAPHOR,
} from "@/data/profile";
import { themes } from "@/lib/themes";

const TAGLINE = PROFILE.title;
const TITLE = `${PROFILE.name} | ${TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.site),
  alternates: {
    canonical: PROFILE.site,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${PROFILE.name} — Writing` },
      ],
    },
  },
  title: TITLE,
  // Composed from PROFILE rather than restated. The previous literal had already
  // drifted: it said "CTO" where the blurb says "Chief Technology Officer", and
  // it folded the metaphor into a blurb whose own doc comment says it is the
  // metaphor-free fallback.
  description: `${PROFILE.blurb} ${METAPHOR}`,
  keywords: [
    PROFILE.name,
    PROFILE.role,
    PROFILE.city,
    "Software Engineer",
    "Infrastructure Engineer",
    "Cybersecurity",
    "Security Engineering",
    "Kubernetes",
    "DevOps",
    "Full-Stack Development",
  ],
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PROFILE.site,
    siteName: `${PROFILE.name} Portfolio`,
    title: TITLE,
    description: METAPHOR,
    // Images come from the generated card in src/app/opengraph-image.tsx.
    // Declaring them here would override that route (and the old /og-image.png
    // never existed in public/, so every social preview 404'd).
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: METAPHOR,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  worksFor: PROFILE_EMPLOYERS.map((employer) => ({
    "@type": "Organization",
    name: employer.name,
  })),
  url: PROFILE.site,
  email: `mailto:${PROFILE.email}`,
  sameAs: PROFILE_SAME_AS,
  knowsAbout: [
    "Software Engineering",
    "Cybersecurity",
    "Network Security",
    "Kubernetes",
    "Platform Engineering",
    "DevOps",
    "Distributed Systems",
    "Infrastructure",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: PROFILE.city,
    addressRegion: PROFILE.region,
    addressCountry: PROFILE.country,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* From the same token applyTheme() writes at runtime, so the static
            tag and the themed one cannot disagree. */}
        <meta name="theme-color" content={themes.metro["metro-bg"]} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
