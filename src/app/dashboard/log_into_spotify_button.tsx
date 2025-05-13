"use client";
import React from "react";
import { spotifyLogin } from "@/api/api";

export default function LogIntoSpotifyButton() {
    const handleLogin = async () => {
        try {
            const data = await spotifyLogin();
            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                console.error("No redirect URL found in the response.");
            }
        } catch (error) {
            console.error("Failed to initiate Spotify login:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogin}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
            Log into Spotify
        </button>
    );
}
