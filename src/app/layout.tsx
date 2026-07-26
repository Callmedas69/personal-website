import type { Metadata } from "next";
import { Providers } from "./providers";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://0xdas.dev"),
  title: "0xdas.dev · talk-to-my-agent",
  description: "AI-native onchain developer building autonomous systems, creative web experiences, and fully onchain products.",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    title: "0xdas",
  },
  openGraph: {
    title: "0xdas.dev · talk-to-my-agent",
    description: "AI-native onchain developer building autonomous systems, creative web experiences, and fully onchain products.",
    siteName: "0xdas.dev",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "0xdas.dev · talk-to-my-agent" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "0xdas.dev · talk-to-my-agent",
    description: "AI-native onchain developer building autonomous systems, creative web experiences, and fully onchain products.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preload" href="https://stripe.dev/fonts/Sohne.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://stripe.dev/fonts/SohneMono-Buch.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/models/0xnull.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-brand-bg text-text-primary">
        <script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem('0xnull-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}`}} />
        <script dangerouslySetInnerHTML={{__html:`try{var b=sessionStorage.getItem('0xnull-booted');if(!b&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.boot='pending';}catch(e){}`}} />
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
