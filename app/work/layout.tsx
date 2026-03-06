import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Case studies showcasing product design, user research, and strategic thinking across early-stage startups and established companies including StudyStream (YC) and Jagex (RuneScape).",
  openGraph: {
    title: "Selected Work | Tayler Hughes",
    description: "Case studies showcasing product design, user research, and strategic thinking across early-stage startups and established companies.",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
