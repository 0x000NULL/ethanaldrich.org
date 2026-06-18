import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ethanaldrich.org"),
  alternates: {
    canonical: "https://ethanaldrich.org",
  },
  title: "Ethan Aldrich | Platform & Infrastructure Engineer",
  description:
    "Ethan Aldrich — Platform & Infrastructure Engineer. Founder & CTO of Fimil. A portfolio mapped as a transit system: career, projects, and learning as subway lines.",
  keywords: [
    "Ethan Aldrich",
    "Platform Engineer",
    "Infrastructure Engineer",
    "Kubernetes",
    "DevOps",
    "Fimil",
    "Security Engineering",
    "Las Vegas",
  ],
  authors: [{ name: "Ethan Aldrich" }],
  creator: "Ethan Aldrich",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ethanaldrich.org",
    siteName: "Ethan Aldrich Portfolio",
    title: "Ethan Aldrich | Platform & Infrastructure Engineer",
    description:
      "A portfolio mapped as a Tokyo-Metro transit system — career, projects, and learning as subway lines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ethan Aldrich Portfolio — career rendered as a subway map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Aldrich | Platform & Infrastructure Engineer",
    description:
      "A portfolio mapped as a Tokyo-Metro transit system — career, projects, and learning as subway lines.",
    images: ["/og-image.png"],
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
  jobTitle: "Platform & Infrastructure Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Fimil",
  },
  url: "https://ethanaldrich.org",
  sameAs: [
    "https://github.com/0x000NULL",
    "https://www.linkedin.com/in/ethanaldrich",
  ],
  knowsAbout: [
    "Kubernetes",
    "Platform Engineering",
    "DevOps",
    "Distributed Systems",
    "Security Engineering",
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
