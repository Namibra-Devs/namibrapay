import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./client-providers";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "NamibraPay | Fast, Reliable & Affordable Payments",
  description:
    "NamibraPay provides fast, reliable, and affordable payment solutions for businesses and individuals.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "NamibraPay | Fast, Reliable & Affordable Payments",
    description:
      "NamibraPay provides fast, reliable, and affordable payment solutions for businesses and individuals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full scroll-smooth antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col font-body">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
