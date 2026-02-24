import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Il Gabbiano SRL | Vigilanza non armata e portierato a Napoli",
  description:
    "Servizi di vigilanza non armata, videosorveglianza, portierato e servizi d'ordine. Sicurezza e professionalità dal 2007. Napoli e Campania.",
  keywords: "vigilanza non armata, portierato, sicurezza, Napoli, sorveglianza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
