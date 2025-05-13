"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { fetchTopGenres } from "../../../api/api";

const TopGenresList: React.FC<{ spotifyId: string }> = ({ spotifyId }) => {
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {


    const getRecs = async () => {
      
    }
    const getTopGenres = async () => {
      try {
        const data = await fetchTopGenres(spotifyId);
        console.log("Top genres:", data);
        setTopGenres(data);
      } catch (error) {
        console.error("Error fetching top genres:", error);
      } finally {
        setLoading(false);
      }
    };

    getTopGenres();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Your Top 5 Genres of the Month
        </h3>
        <p>Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Your Top 5 Genres of the Month
      </h3>
      <div className="space-y-3">
        {topGenres.slice(0, 5).map((genre, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground">{index + 1}</span>
            <span className="font-medium">{genre
                .split(' ') // Split by spaces
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                .join(' ')}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopGenresList;
