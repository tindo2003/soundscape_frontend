"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { recentTracks } from "@/lib/dashboard-data";
import { fetchSavedAlbums } from "../../api/api";
import { UserTopTrack } from "../../types";
import { UserSavedAlbums } from "../../types";


export const SavedAlbums: React.FC<{ spotifyId: string }> = ({ spotifyId }) => {


  const [savedAlbums, setSavedAlbums] = useState<UserSavedAlbums[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function formatRuntime(milliseconds: number) {
    const minutes = Math.floor(milliseconds / 60000); // Convert to minutes
    const seconds = Math.floor((milliseconds % 60000) / 1000); // Get remaining seconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ensure two-digit seconds
  }

  useEffect(() => {
    const getSavedAlbums = async () => {
      try {
        const data = await fetchSavedAlbums(spotifyId);
        console.log("Top genres:", data);
        setSavedAlbums(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching top genres:", error);
      } finally {
        setLoading(false);
      }
    };

    getSavedAlbums();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Saved Albums</h2>
        <div className="flex items-center gap-2">
        </div>
      </div>
      <div className="space-y-4">
        {savedAlbums.map((track, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={track.album.art}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <p className="font-medium">{track.album.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default SavedAlbums;