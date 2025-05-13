import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import ListeningHistory from "@/components/ListeningHistory";
import TopArtists from "@/components/TopArtists";
import ConnectSection from "@/components/ConnectSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ListeningHistory />
        <TopArtists />
        <ConnectSection />
      </main>
    </div>
  );
}