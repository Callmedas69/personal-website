import Header from "@/components/Header";
import BootOverlay from "@/components/sections/BootOverlay";
import HeroSection from "@/components/sections/HeroSection";
import TerminalSection from "@/components/sections/TerminalSection";
import LogStrip from "@/components/sections/LogStrip";
import OnchainSection from "@/components/sections/OnchainSection";
import SiteFooter from "@/components/sections/SiteFooter";
import Mascot from "@/components/mascot/Mascot";
import { getRecentPosts } from "@/lib/paragraph";

export default async function Home() {
  const posts = await getRecentPosts(8);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">
      {/* Background radial grid effect — fixed so it holds across the full scroll */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0" />

      <BootOverlay />
      <Mascot />
      <Header />

      <main className="relative z-10 flex-1 w-full">
        <HeroSection />
        <TerminalSection />
        <LogStrip posts={posts} />
        <OnchainSection />
      </main>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
