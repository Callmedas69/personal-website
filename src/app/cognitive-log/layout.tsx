import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "0xdas.dev · cognitive-log",
  description: "the log of the build process. thinking, failures, and deploys, documented mid-thought.",
};

export default function CognitiveLogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
