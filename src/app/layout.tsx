import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ethanaldrich.org"),
  title: "Ethan Aldrich | CTO & IT Infrastructure Specialist",
  description:
    "Personal portfolio of Ethan Aldrich - CTO specializing in IT infrastructure, homelab engineering, and automotive projects. Experience the web like it's 1995.",
  keywords: [
    "Ethan Aldrich",
    "CTO",
    "IT Infrastructure",
    "SQL Server",
    "Power BI",
    "Homelab",
    "Las Vegas",
    "Budget Rent a Car",
    "Malco Enterprises",
  ],
  authors: [{ name: "Ethan Aldrich" }],
  creator: "Ethan Aldrich",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ethanaldrich.org",
    siteName: "Ethan Aldrich Portfolio",
    title: "Ethan Aldrich | CTO & IT Infrastructure Specialist",
    description:
      "Personal portfolio of Ethan Aldrich - CTO specializing in IT infrastructure, homelab engineering, and automotive projects.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ethan Aldrich Portfolio - Retro BIOS Theme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethan Aldrich | CTO & IT Infrastructure Specialist",
    description:
      "Personal portfolio of Ethan Aldrich - CTO specializing in IT infrastructure, homelab engineering, and automotive projects.",
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
  jobTitle: "Chief Technology Officer",
  worksFor: {
    "@type": "Organization",
    name: "Malco Enterprises of Nevada, LLC",
  },
  url: "https://ethanaldrich.org",
  knowsAbout: [
    "IT Infrastructure",
    "SQL Server",
    "Power BI",
    "Network Administration",
    "Homelab Engineering",
    "Linux Systems",
    "Virtualization",
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
        <meta name="theme-color" content="#0000AA" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bios-text">{children}</body>
    </html>
  );
}
