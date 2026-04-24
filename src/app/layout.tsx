import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NamibraPay | Fast, Reliable & Affordable Payments",
  description:
    "NamibraPay provides fast, reliable, and affordable payment solutions for businesses and individuals.",
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
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
