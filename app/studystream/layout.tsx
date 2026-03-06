import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudyStream Case Study",
  description: "Leading product design for a YC-backed startup from concept to product-market fit at global scale. From a Zoom call to 3 million students.",
  openGraph: {
    title: "StudyStream Case Study | Tayler Hughes",
    description: "Leading product design for a YC-backed startup from concept to product-market fit. From a Zoom call to 3 million students.",
  },
};

export default function StudyStreamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
