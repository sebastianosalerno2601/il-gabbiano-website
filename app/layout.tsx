import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://vigilanzanonarmatailgabbiano.it";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Il Gabbiano SRL | Vigilanza non armata e portierato a Napoli",
    template: "%s | Il Gabbiano SRL",
  },
  description:
    "Servizi di vigilanza non armata, videosorveglianza, portierato e servizi d'ordine a Napoli. Sicurezza e professionalità dal 2007. Preventivi gratuiti.",
  keywords: [
    "vigilanza non armata Napoli",
    "portierato Napoli",
    "servizi sicurezza Campania",
    "videosorveglianza",
    "servizi d'ordine",
    "Il Gabbiano vigilanza",
    "sorveglianza aziende Napoli",
  ],
  authors: [{ name: "Il Gabbiano SRL", url: siteUrl }],
  creator: "Il Gabbiano SRL",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "Il Gabbiano SRL",
    title: "Il Gabbiano SRL | Vigilanza non armata e portierato a Napoli",
    description:
      "Servizi di vigilanza non armata, videosorveglianza e portierato a Napoli. Dal 2007, sicurezza e professionalità per privati e aziende.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Gabbiano SRL | Vigilanza non armata e portierato a Napoli",
    description: "Servizi di vigilanza non armata, videosorveglianza e portierato a Napoli. Dal 2007.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#organization`,
      name: "Il Gabbiano SRL",
      description:
        "Servizi di vigilanza non armata, videosorveglianza, portierato e servizi d'ordine a Napoli e Campania. Sicurezza e professionalità dal 2007.",
      url: siteUrl,
      telephone: "+393319989456",
      foundingDate: "2007",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Centro Direzionale Isola A/7 scala A",
        addressLocality: "Napoli",
        postalCode: "80143",
        addressRegion: "Campania",
        addressCountry: "IT",
      },
      areaServed: [
        { "@type": "City", name: "Napoli" },
        { "@type": "AdministrativeArea", name: "Campania" },
      ],
      priceRange: "€€",
      image: `${siteUrl}/opengraph-image`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Il Gabbiano SRL",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
