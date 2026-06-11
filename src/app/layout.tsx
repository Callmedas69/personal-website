import type { Metadata } from "next";
import { Providers } from "./providers";
import SmoothScroll from "@/components/SmoothScroll";
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preload" href="https://stripe.dev/fonts/Sohne.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://stripe.dev/fonts/SohneMono-Buch.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
