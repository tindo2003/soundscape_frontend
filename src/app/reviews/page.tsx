import ReviewsHeader from "@/components/reviews/ReviewsHeader";
import ReviewsDisplay from "@/components/reviews/ReviewsDisplay";
import { Sidebar } from "@/components/dashboard/Sidebar";
import LastPlayed from "@/components/dashboard/LastPlayed";
import TopArtistsGrid from "@/components/dashboard/TopArtistsGrid";
import GenreStats from "@/components/dashboard/GenreStats";
import Recommendation from "@/components/dashboard/Recommendation";

import { fetchTopTracksSaved } from "../../api/api";
import { Track } from "../../types";

import React, { useEffect, useState } from "react";
import  Layout  from "../../components/reviews/layout";
import { verifySession } from "@/app/auth/auth_server";

async function ReviewsPage() {

  const session = await verifySession();
  const spotifyId = session.spotify_id;

  if (!spotifyId) {
    return <div>No Spotify ID found.</div>;
  }

  return (
    <div className="p-8">
      <Layout spotifyId={spotifyId} />
    </div>
  );
}

export default ReviewsPage;