import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jagex Case Study",
  description: "Designing for a 300 million player legacy. Lead Product Designer for Jagex's publishing platform team working on RuneScape, one of the longest-running MMORPGs in history.",
  openGraph: {
    title: "Jagex Case Study | Tayler Hughes",
    description: "Designing for a 300 million player legacy. Lead Product Designer working on RuneScape's publishing platform.",
  },
};

export default function JagexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
