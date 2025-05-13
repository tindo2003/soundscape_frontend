"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { recentTracks } from "@/lib/dashboard-data";
import { fetchTopTracks } from "../../api/api";
import { Track, UserTopTrack } from "../../types";

export const TopTracks: React.FC<{ spotifyId: string }> = ({ spotifyId }) => {
    const [topTracks, setTopTracks] = useState<UserTopTrack[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function formatRuntime(milliseconds: number) {
        const minutes = Math.floor(milliseconds / 60000); // Convert to minutes
        const seconds = Math.floor((milliseconds % 60000) / 1000); // Get remaining seconds
        return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Ensure two-digit seconds
    }

    useEffect(() => {
        const getTopTracks = async () => {
            try {
                const data = await fetchTopTracks(spotifyId);
                console.log("Fetched top tracks", data);
                setTopTracks(data.slice(0, 10));
            } catch (error) {
                console.error("Error fetching top genres:", error);
            } finally {
                setLoading(false);
            }
        };

        getTopTracks();
    }, []);

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Top Tracks</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Runtime
                    </span>
                </div>
            </div>
            <div className="space-y-4">
                {topTracks.map((track, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-muted-foreground">
                                {index + 1}
                            </span>
                            <img
                                src={track.track.art}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                                <p className="font-medium">
                                    {track.track.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {track.track.artists.map(
                                        (artist, index) => (
                                            <span key={index}>
                                                {artist.name}
                                                {index <
                                                    track.track.artists.length -
                                                        1 && ", "}
                                            </span>
                                        )
                                    )}
                                </p>
                            </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {formatRuntime(track.track.duration_ms)}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TopTracks;
