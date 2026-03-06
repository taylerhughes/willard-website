import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signal Engine™",
  description: "A systematic approach to installing certainty into product decisions. The Signal Engine™ is our proprietary framework for turning user research into confident product decisions.",
  openGraph: {
    title: "Signal Engine™ | Tayler Hughes",
    description: "A systematic approach to installing certainty into product decisions without slowing teams down.",
  },
};

export default function SignalEngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
