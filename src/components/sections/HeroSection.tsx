"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { sampleUsers } from "@/lib/sample-data";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            Build your soundscape.
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with music lovers who share your unique taste. Discover new
            artists, tracks, and friends through the power of shared listening
            habits.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg">
              Get started
            </Button>
          </Link>
        </div>
        <div className="relative">
          <Carousel className="w-full space-y-2">
            {sampleUsers.map((user, index) => (
              <Card key={index} className="p-6 space-y-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">
                    Match Score: {user.matchScore}
                  </p>
                  <p className="text-sm">Top Artist: {user.topArtist}</p>
                </div>
              </Card>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
