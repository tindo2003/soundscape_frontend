"use client";

import ReviewsDisplay from "@/components/reviews/ReviewsDisplay";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";
import { fetchTopTracksSaved, recentTracksSaved, searchSongs } from "../../api/api";
import { Track } from "../../types";

import React, { useEffect, useState } from "react";

interface SpotifyIdProps {
    spotifyId: string;
}


export default function Layout ({spotifyId}: SpotifyIdProps) {

  // get recently played
  const [name, setName] = useState("");
  const [savedRecentTracks, setSavedRecentTracks] = useState<Track[]>([]);
  const [recents, setRecents] = useState<Track[]>([]);
  const [savedTopTracks, setSavedTopTracks] = useState<Track[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);


  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }
    const results = await searchSongs(spotifyId, searchQuery); // Assume searchSongs is a function that fetches search results
    setSearchResults(results);
    setIsSearchActive(true);
  };

  // get top songs
    useEffect(() => {

      const getRecentsAttempt = async () => {
        try {
          
          const data = await recentTracksSaved(spotifyId);
          setRecents(data);
          // setSavedAlbums(data.slice(0, 5));
        } catch (error) {
          console.error("Error fetching top genres:", error);
        } finally {
          // setLoading(false);
        }
      };

      const getSavedRecentTracks = async () => {
        try {
          
          const data = await fetchTopTracksSaved(spotifyId, "recent");
          setSavedRecentTracks(data);
          // setSavedAlbums(data.slice(0, 5));
        } catch (error) {
          console.error("Error fetching top genres:", error);
        } finally {
          // setLoading(false);
        }
      };

      const getSavedTopTracks = async () => {
        try {
          console.log("the spotifyId is: " + spotifyId)
          const data = await fetchTopTracksSaved(spotifyId, "top");
          console.log("Top tracks:", data);
          setSavedTopTracks(data);
        } catch (error) {
          console.error("Error fetching top genres:", error);
        }
      };

      async function fetchData() {
        const res = await fetch(`${DJANGO_USER_ENDPOINT}/get_name/`, {
            credentials: "include", // include cookies in the request
        });
        const data = await res.json();
        setName(data.name);
    }
      getRecentsAttempt();
      getSavedRecentTracks();
      getSavedTopTracks();
      fetchData();
      

    }, [spotifyId]);




  return (
      <div >
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold">Hello there, {name? name.split(" ")[0] : "Guest"}</h1>
                <p className="text-muted-foreground mt-1">
                    Check out song reviews!
                </p>
                <div className="mt-8">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search for a review"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[300%] md:w-[150%] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </form>
                </div>
            </div>
        </div>
        {isSearchActive ? (
        <div>
          <h2 className="text-2xl font-bold mt-8">Search Results</h2>
          <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
            {searchResults.map((song, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
              >
                <a href={`/reviews/${song.track_id}`} className="block h-full">
                  {song.art ? (
                    <img
                      src={song.art}
                      alt="Song cover art"
                      className="w-full h-40 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <p className="mt-4 text-center text-sm font-medium">{song.name}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ReviewsDisplay
            songs={recents}
            heading={
              "You listened to these songs recently. We'd love for you to review them!"
            }
          />
          <ReviewsDisplay
            songs={savedTopTracks}
            heading={"Check out the reviews for these songs!"}
          />
        </>
      )}
      </div>

  );
}