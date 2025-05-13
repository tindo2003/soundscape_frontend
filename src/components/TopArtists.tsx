"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { topArtists } from "@/lib/sample-data";

export default function TopArtists() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12">Top Artists & Genres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topArtists.map((artist, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                <Badge variant="secondary" className="mb-4">
                  {artist.genre}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {artist.matchedUsers} listeners with similar taste
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}