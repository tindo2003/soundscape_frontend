"use client";

import TopGenresList from "./lists/TopGenresList";
import GenreChart from "./charts/GenreChart";

interface GenreStatsProps {
    spotifyId: string;
}

export default function GenreStats({ spotifyId }: GenreStatsProps) {
    return (
        <div className="space-y-6">
            <TopGenresList spotifyId={spotifyId} />
            <GenreChart />
        </div>
    );
}
