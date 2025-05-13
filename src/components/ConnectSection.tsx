"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { recommendedUsers } from "@/lib/sample-data";

export default function ConnectSection() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold">Connect with Music Lovers</h2>
          <Users className="h-8 w-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedUsers.map((user, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.compatibility}% compatible
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Common Artists:
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.commonArtists.map((artist, i) => (
                    <span
                      key={i}
                      className="text-xs bg-secondary px-2 py-1 rounded"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="w-full">Connect</Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}