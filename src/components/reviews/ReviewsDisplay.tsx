"use client";

import { Track } from "../../types";

interface Song {
  title: string;
  art: string; // URL to the album art
}

interface FavoriteSongsProps {
  songs: Track[];
  heading: string;
}


const ReviewsDisplay: React.FC<FavoriteSongsProps> = ({ songs, heading }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>
      <div className="flex overflow-x-auto space-x-6 no-scrollbar">
        {songs.map((song, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-64"
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
  );
};

export default ReviewsDisplay;