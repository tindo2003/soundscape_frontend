"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { recentTracks } from "@/lib/dashboard-data";
import { fetchTopTracks } from "../../api/api";
import { UserTopTrack } from "../../types";
import { TopTracks } from "./TopTracks";
import { SavedAlbums } from "./SavedAlbums";

interface LastPlayedProps {
    spotifyId: string;
}

export default function LastPlayed({ spotifyId }: LastPlayedProps) {
    return (
        <div>
            <TopTracks spotifyId={spotifyId} />
            <SavedAlbums spotifyId={spotifyId} />
        </div>
    );
}
