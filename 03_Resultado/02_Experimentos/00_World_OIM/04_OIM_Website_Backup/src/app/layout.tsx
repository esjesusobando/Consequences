import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Load only Geist Sans — Mono not used in UI, saves ~20KB
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// ─── SEO SOTA ────────────────────────────────────────────────────────────────
const siteUrl = "https://oimatlanta.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Office Furniture Installation Atlanta | OIM",
    template: "%s | OIM Atlanta",
  },
  description:
    "Professional office furniture installation in Atlanta, GA. Cubicles, desks, workstations, TVs, whiteboards & full office setups. Licensed & insured since 2018. Free quote: +1 (470) 595-0121.",

  keywords: [
    "office furniture installation Atlanta",
    "commercial furniture assembly Georgia",
    "office setup Atlanta GA",
    "furniture relocation Atlanta",
    "bilingual office installers Atlanta",
    "cubicle installation Atlanta",
    "workstation setup Atlanta",
    "Office Installations Mayen",
    "OIM Atlanta",
  ],

  authors: [{ name: "Office Installations Mayen" }],
  creator: "OIM",
  publisher: "OIM",

  // ── Open Graph ──
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_US"],
    url: siteUrl,
    siteName: "OIM - Office Installations Mayen",
    title: "Office Furniture Installation Atlanta | OIM",
    description:
      "Professional office furniture installation & relocation in Atlanta. Bilingual (EN/ES), licensed & insured. Free quotes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OIM - Office Furniture Installation Atlanta",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X ──
  twitter: {
    card: "summary_large_image",
    title: "Office Furniture Installation Atlanta | OIM",
    description:
      "Professional office furniture installation & relocation in Atlanta. Bilingual, licensed & insured.",
    images: ["/og-image.jpg"],
  },

  // ── Canonicals + hreflang ──
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "es-US": `${siteUrl}?lang=es`,
      "x-default": siteUrl,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon-drill.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // ── Verification (add when available) ──
  // verification: { google: "GOOGLE_SEARCH_CONSOLE_TOKEN" },

  category: "business",
};

// ─── Structured Data — LocalBusiness + Service ───────────────────────────────
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
      name: "Office Installations Mayen",
      alternateName: "OIM",
      description:
        "Professional office furniture installation, setup, and relocation services in Atlanta, GA since 2018.",
      url: siteUrl,
      telephone: "+1-470-595-0121",
      email: "oiminstallllc@gmail.com",
      foundingDate: "2018",
      image: `${siteUrl}/og-image.jpg`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-drill.png`,
      },
      areaServed: [
        { "@type": "City", name: "Atlanta", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Marietta", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Alpharetta", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Decatur", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Sandy Springs", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Roswell", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Duluth", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Norcross", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Kennesaw", containedInPlace: { "@type": "State", name: "Georgia" } },
        { "@type": "City", name: "Smyrna", containedInPlace: { "@type": "State", name: "Georgia" } },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "3715 Northcrest Rd Suite 19",
        addressLocality: "Atlanta",
        addressRegion: "GA",
        postalCode: "30340",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 33.8922,
        longitude: -84.3244,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "18:00",
        },
      ],
      priceRange: "$$",
      currenciesAccepted: "USD",
      paymentAccepted: "Cash, Credit Card, Check",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Office Furniture Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Office Furniture Installation", provider: { "@id": `${siteUrl}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Office Setup & Reconfiguration", provider: { "@id": `${siteUrl}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Furniture Disassembly & Moving", provider: { "@id": `${siteUrl}/#business` } } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Projects", provider: { "@id": `${siteUrl}/#business` } } },
        ],
      },
      sameAs: [
        "https://www.instagram.com/oimayen",
        "https://wa.me/14705950121",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does office furniture installation cost in Atlanta?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Office furniture installation costs in Atlanta vary by project size. Small setups (1–5 workstations) typically range from $150–$500. Full office builds or relocations are quoted individually. Contact OIM at +1 (470) 595-0121 for a free estimate.",
          },
        },
        {
          "@type": "Question",
          name: "What areas does OIM serve in the Atlanta metro?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "OIM serves all of the Greater Atlanta metro area including Atlanta, Marietta, Alpharetta, Decatur, Sandy Springs, Roswell, Duluth, and surrounding Georgia communities.",
          },
        },
        {
          "@type": "Question",
          name: "Does OIM install cubicles and workstations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. OIM installs all major brands of cubicles, panel systems, open-plan workstations, benching, private office furniture, and executive suites. We also handle disassembly and relocation.",
          },
        },
        {
          "@type": "Question",
          name: "Is OIM licensed and insured?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Office Installations Mayen (OIM) is fully licensed and insured for commercial furniture installation in Georgia. We have been serving Atlanta businesses since 2018.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer bilingual office installation services?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. OIM is a bilingual team fluent in English and Spanish, serving both English- and Spanish-speaking businesses in Atlanta and the surrounding metro area.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "OIM - Office Installations Mayen",
      description: "Office furniture installation services in Atlanta, GA",
      publisher: { "@id": `${siteUrl}/#business` },
      inLanguage: ["en-US", "es-US"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f4f6f8] text-[#0d1b2a]">
        {children}
      </body>
    </html>
  );
}
