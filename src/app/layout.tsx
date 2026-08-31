import type { Metadata } from "next";
import "./globals.css";

const TAGLINE = "Software, Infrastructure & Security Engineering";
const TITLE = `Ethan Aldrich | ${TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://ethanaldrich.org"),
  alternates: {
    canonical: "https://ethanaldrich.org",
  },
  title: TITLE,
  description:
    "Ethan Aldrich — CTO at Budget Rent a Car Las Vegas and Twelve Management, working across software, infrastructure, and security engineering. A portfolio mapped as a transit system: career, projects, and learning as subway lines.",
  keywords: [
    "Ethan Aldrich",
    "Software Engineer",
    "Infrastructure Engineer",
    "Cybersecurity",
    "Security Engineering",
    "Chief Technology Officer",
    "Kubernetes",
    "DevOps",
    "Full-Stack Development",
    "Las Vegas",
  ],
  authors: [{ name: "Ethan Aldrich" }],
  creator: "Ethan Aldrich",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ethanaldrich.org",
    siteName: "Ethan Aldrich Portfolio",
    title: TITLE,
    description:
      "A portfolio mapped as a Tokyo-Metro transit system — career, projects, and learning as subway lines.",
    // Images come from the generated card in src/app/opengraph-image.tsx.
    // Declaring them here would override that route (and the old /og-image.png
    // never existed in public/, so every social preview 404'd).
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "A portfolio mapped as a Tokyo-Metro transit system — career, projects, and learning as subway lines.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ethan Aldrich",
  jobTitle: "Chief Technology Officer",
  worksFor: [
    {
      "@type": "Organization",
      name: "Malco Enterprises of Nevada (Budget Rent a Car Las Vegas)",
    },
    {
      "@type": "Organization",
      name: "Twelve Management",
    },
  ],
  url: "https://ethanaldrich.org",
  sameAs: [
    "https://github.com/0x000NULL",
    "https://www.linkedin.com/in/ethan-aldrich",
  ],
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
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    addressCountry: "US",
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
        <meta name="theme-color" content="#F7F4EC" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
