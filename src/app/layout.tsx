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
  metadataBase: new URL('https://namibrapay.com'),
  title: {
    default: "NamibraPay | Fast, Reliable & Affordable Payments",
    template: "%s | NamibraPay"
  },
  description:
    "NamibraPay provides fast, reliable, and affordable payment solutions for businesses and individuals across Ghana. Accept mobile money, process payouts, and manage settlements seamlessly.",
  keywords: [
    "payment gateway Ghana",
    "mobile money Ghana",
    "MTN mobile money",
    "Vodafone Cash",
    "AirtelTigo Money",
    "payment processing",
    "merchant payments",
    "payment solution",
    "NamibraPay",
    "fintech Ghana",
    "digital payments",
    "payment API",
  ],
  authors: [{ name: "NamibraPay" }],
  creator: "NamibraPay",
  publisher: "NamibraPay",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://namibrapay.com",
    siteName: "NamibraPay",
    title: "NamibraPay | Fast, Reliable & Affordable Payments",
    description:
      "NamibraPay provides fast, reliable, and affordable payment solutions for businesses and individuals across Ghana. Accept mobile money, process payouts, and manage settlements seamlessly.",
    images: [
      {
        url: "/logo-md.png", // Update with actual OG image path (recommended: 1200x630px)
        width: 1200,
        height: 630,
        alt: "NamibraPay - Payment Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NamibraPay | Fast, Reliable & Affordable Payments",
    description:
      "Fast, reliable, and affordable payment solutions for businesses and individuals across Ghana.",
    images: ["/logo-md.png"], // Update with actual Twitter card image
    creator: "@namibrapay", // Update with actual Twitter handle
  },
  verification: {
    // google: "your-google-site-verification-code", // Add when available
    // yandex: "your-yandex-verification-code", // Add if needed
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
