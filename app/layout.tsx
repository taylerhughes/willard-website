import type { Metadata } from "next";
import { Figtree, Bebas_Neue, Poppins, Inter_Tight } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Tayler Hughes | Product Design Consultant",
    template: "%s | Tayler Hughes"
  },
  description: "Product design consultant helping funded startups shape ideas into products people actually want to use. 14 years experience, 300 million users, YC-backed companies.",
  keywords: ["product design", "UX design", "user research", "product strategy", "startup consulting", "YC", "Y Combinator"],
  authors: [{ name: "Tayler Hughes" }],
  creator: "Tayler Hughes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taylerhughes.co.uk",
    siteName: "Tayler Hughes",
    title: "Tayler Hughes | Product Design Consultant",
    description: "Product design consultant helping funded startups shape ideas into products people actually want to use.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tayler Hughes | Product Design Consultant",
    description: "Product design consultant helping funded startups shape ideas into products people actually want to use.",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${figtree.variable} ${bebas.variable} ${poppins.variable} ${interTight.variable} antialiased m-0 p-0 h-full`}
      >
        <div className="bg-[#fafafa] relative min-h-screen w-full font-figtree p-8">
          {children}
        </div>
      </body>
    </html>
  );
}