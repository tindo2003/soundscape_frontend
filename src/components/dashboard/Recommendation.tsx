"use client";

import React, { useEffect, useState } from "react";
import {
    fetchRecsUsingAssociationRules,
    fetchRecsContentBased,
} from "@/api/api";
import { Card } from "@/components/ui/card";
import { Track } from "../../types";

const Recommendations = ({ spotifyId }: { spotifyId: string }) => {
    const [arRecs, setArRecs] = useState<Track[]>([]);
    const [cbRecs, setCbRecs] = useState<Track[]>([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const arData = await fetchRecsUsingAssociationRules(spotifyId);
                console.log("Data for AR recs is", arData.data);
                setArRecs(arData.data);

                const cbData = await fetchRecsContentBased(spotifyId);
                console.log("Data for CB recs is", cbData.data);
                setCbRecs(cbData.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, [spotifyId]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Based on what you and others have listened to
                </h2>
            </div>
            <div className="flex flex-wrap justify-center space-x-4">
                {arRecs.map((rec, index) => (
                    <div
                        className="relative inline-block border border-gray-300 rounded-lg overflow-hidden w-40 h-40 mx-2"
                        key={index}
                    >
                        <img
                            alt={rec.name}
                            className="w-full h-full object-cover"
                            src={rec.album.images[0]?.url || "placeholder.jpg"}
                        />
                        {/* Hover box */}
                        <div className="absolute top-0 left-0 z-10 bg-white border border-gray-300 rounded-lg w-48 max-h-40 overflow-auto overflow-x-auto shadow-md p-3 transition-transform duration-200 ease-in-out transform opacity-0 hover:opacity-100 hover:translate-y-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                {rec.name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Artist(s):</span>{" "}
                                {rec.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Album:</span>{" "}
                                {rec.album.name}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Duration:</span>{" "}
                                {(rec.duration_ms / 60000).toFixed(2)} min
                            </p>
                            <p className="text-xs text-gray-600 mb-3">
                                <span className="font-medium">Popularity:</span>{" "}
                                {rec.popularity}
                            </p>
                            <a
                                href={rec.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-xs text-white bg-[#1ED760] hover:bg-[#1DB954] px-4 py-2 rounded-lg"
                            >
                                Listen on Spotify
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Similar Content
                </h2>
            </div>
            <div className="flex flex-wrap justify-center space-x-4">
                {cbRecs.map((rec, index) => (
                    <div
                        className="relative inline-block border border-gray-300 rounded-lg overflow-hidden w-40 h-40 mx-2"
                        key={index}
                    >
                        <img
                            alt={rec.name}
                            className="w-full h-full object-cover"
                            src={rec.album.images[0]?.url || "placeholder.jpg"}
                        />
                        {/* Hover box */}
                        <div className="absolute top-0 left-0 z-10 bg-white border border-gray-300 rounded-lg w-48 max-h-40 overflow-auto overflow-x-auto shadow-md p-3 transition-transform duration-200 ease-in-out transform opacity-0 hover:opacity-100 hover:translate-y-0">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                {rec.name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Artist(s):</span>{" "}
                                {rec.artists
                                    .map((artist) => artist.name)
                                    .join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Album:</span>{" "}
                                {rec.album.name}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                                <span className="font-medium">Duration:</span>{" "}
                                {(rec.duration_ms / 60000).toFixed(2)} min
                            </p>
                            <p className="text-xs text-gray-600 mb-3">
                                <span className="font-medium">Popularity:</span>{" "}
                                {rec.popularity}
                            </p>
                            <a
                                href={rec.external_urls.spotify}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-xs text-white bg-[#1ED760] hover:bg-[#1DB954] px-4 py-2 rounded-lg"
                            >
                                Listen on Spotify
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recommendations;
