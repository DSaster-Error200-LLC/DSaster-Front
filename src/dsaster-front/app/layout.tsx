import type { Metadata } from "next";
import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Ticket DSaster design-system families; globals.css maps them onto
// --font-display, --font-sans and --font-mono.
const displayFont = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

const sansFont = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Ticket DSaster — Tus entradas favoritas, sin dramas ni desastres",
  description:
    "Descubre los mejores conciertos, festivales, teatro y deportes con compra protegida, precios transparentes y acceso inmediato en tu móvil.",
};

const fontVariables = [
  displayFont.variable,
  sansFont.variable,
  monoFont.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The design system's default dark "stage" theme. Set data-theme="paper"
    // on a subtree for light surfaces such as printable tickets.
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
