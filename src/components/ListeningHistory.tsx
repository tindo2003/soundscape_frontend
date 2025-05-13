"use client";

import { Card } from "@/components/ui/card";
import { History, Clock, Music2 } from "lucide-react";
import { listeningStats } from "@/lib/sample-data";

const iconMap = {
  Clock,
  Music2,
  History,
};

export default function ListeningHistory() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12">Listening History</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {listeningStats.map((stat, index) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon className="h-8 w-8" />
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}