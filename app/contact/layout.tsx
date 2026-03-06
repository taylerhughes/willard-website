import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tayler Hughes. Whether you need strategic product thinking, user research infrastructure, or hands-on design — let's talk about how I can help.",
  openGraph: {
    title: "Contact | Tayler Hughes",
    description: "Get in touch with Tayler Hughes for product design consulting.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
