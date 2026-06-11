import type { Metadata } from "next";
import type { ReactNode } from "react";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Qué tan termo sos?",
    description:
      "30 decisiones futboleras. Descubrí tu nivel de termismo y tu perfil argento-futbolístico. 🇦🇷⚽",
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
      <body>{children}</body>
    </html>
  );
}
