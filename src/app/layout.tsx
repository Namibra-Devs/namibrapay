import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NamibraPay — Fast, Reliable & Affordable Payments",
  description:
    "NamibraPay provides fast, reliable, and affordable payment solutions for businesses and individuals.",
  openGraph: {
    title: "NamibraPay — Fast, Reliable & Affordable Payments",
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
    <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
