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
    default: "Vigilanza non armata Napoli | Portierato e sicurezza | Il Gabbiano SRL",
    template: "%s | Il Gabbiano SRL",
  },
  description:
    "Vigilanza non armata a Napoli e Campania, portierato, videosorveglianza e servizi d'ordine. Dal 2007 sicurezza per aziende e condomini. Preventivo gratuito.",
  keywords: [
    "vigilanza non armata Napoli",
    "portierato Napoli",
    "vigilanza non armata Campania",
    "servizi sicurezza Napoli",
    "videosorveglianza Napoli",
    "servizi d'ordine",
    "sorveglianza aziende Napoli",
    "portierato condomini Napoli",
  ],
  authors: [{ name: "Il Gabbiano SRL", url: siteUrl }],
  creator: "Il Gabbiano SRL",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "Il Gabbiano SRL",
    title: "Vigilanza non armata Napoli | Portierato | Il Gabbiano SRL",
    description:
      "Vigilanza non armata a Napoli e Campania, portierato e videosorveglianza. Dal 2007. Preventivo gratuito.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vigilanza non armata Napoli | Portierato | Il Gabbiano SRL",
    description: "Vigilanza non armata a Napoli e Campania, portierato e videosorveglianza. Dal 2007. Preventivo gratuito.",
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
