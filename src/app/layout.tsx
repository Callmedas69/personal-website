import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "0xdas.dev · talk-to-my-agent",
  description: "AI-native onchain developer building autonomous systems, creative web experiences, and fully onchain products.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-bg text-text-primary">
        <script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem('0xnull-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}`}} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
