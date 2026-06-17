import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "¿Qué tan termo sos?",
  description:
    "30 decisiones futboleras. Sin respuestas correctas. Descubrí tu nivel de termismo y tu perfil argento-futbolístico.",
  openGraph: {
    title: "¿Qué tan termo sos?",
    description:
      "30 decisiones futboleras. Descubrí tu nivel de termismo y tu perfil argento-futbolístico. 🇦🇷⚽",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "https://quetantermo.com.ar/og-image.png",
        width: 1200,
        height: 630,
        alt: "¿Qué tan termo sos?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Qué tan termo sos?",
    description:
      "30 decisiones futboleras. Descubrí tu nivel de termismo y tu perfil argento-futbolístico. 🇦🇷⚽",
    images: ["https://quetantermo.com.ar/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090c10",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es-AR">
      <body>
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-BY38WQT502" />
    </html>
  );
}
