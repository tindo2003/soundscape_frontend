"use client";

import React, { useEffect, useState } from "react";
import { fetchTopArtists } from "../../api/api";
import { UserTopArtist } from "../../types";
import { Card } from "@/components/ui/card";

const TopArtistsGrid: React.FC<{ spotifyId: string }> = ({ spotifyId }) => {
    const [artists, setArtists] = useState<UserTopArtist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getTopArtists = async () => {
            try {
                const data = await fetchTopArtists(spotifyId);
                console.log("Fetched top artists data:", data);
                setArtists(data.slice(0, 10)); // Limit to top 10
            } catch (error) {
                console.error("Error fetching top artists:", error);
            } finally {
                setLoading(false);
            }
        };

        getTopArtists();
    }, [spotifyId]);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="text-center">Loading...</div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                    Your Top 10 Artists of the Month
                </h2>
            </div>
            <div className="grid grid-cols-5 gap-4">
                {artists.map((item) => (
                    <div key={item.artist.artist_id} className="text-center">
                        <img
                            src={
                                item.artist.images[0]?.url ||
                                "/fallback-image.png"
                            } // Use the first image or a fallback
                            alt={item.artist.name}
                            className="w-full aspect-square rounded-full object-cover mb-2"
                        />
                        <p className="text-sm font-medium truncate">
                            {item.artist.name}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TopArtistsGrid;
