"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ConcertsHeader() {
  const [location, setLocation] = useState<string>("Location not set");

  const handleLocationEnable = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would typically reverse geocode the coordinates
          // For now, we'll just show the coordinates
          setLocation(
            `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`
          );
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold">Upcoming Concerts</h1>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
          <Button variant="link" className="text-sm" onClick={handleLocationEnable}>
            Update location
          </Button>
        </div>
      </div>
    </div>
  );
} 