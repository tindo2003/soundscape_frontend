import { GetStaticProps, GetStaticPaths } from 'next';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import  Layout  from "../../../components/reviews/singlelayout";
import { verifySession } from "@/app/auth/auth_server";


interface SingleReviewProps {
  trackId: string;
  spotifyId: string;
}

interface InputProp {
  spotifyId: string;
  trackId: string
}


// export default function Page(props: { params: Promise<{ track_id: string }> }) {
export default async function Page({
  params,
}: {
  params: Promise<{track_id: string}>;
}) {
  const track_id = (await params).track_id;
  const session = await verifySession();
  const spotifyId = session.spotify_id; // assuming payload key is "spotifyid"

  if (!spotifyId) {
    return <div>Unauthorized.</div>;
  }
  return (
    <div className="p-8">
      <Layout spotifyId={spotifyId} trackId={track_id}/>
    </div>
  );
  
  /*
  
  const params = await props.params;
  return (
    <div className="p-8">
      <Layout spotifyId="tindooooo" trackId={params.track_id}/>
    </div>
  );
  */
}


/*
const SingleReview: React.FC<SingleReviewProps> = ({ trackId, spotifyId }) => {
  console.log('big joe chung')
  const router = useRouter();
  // const { track_id } = params; // Extract track_id from the URL


  console.log(trackId)
  return (
    <div className="p-8">
      <Layout spotifyId="tindooooo" trackId={trackId}/>
    </div>
  );
}


export default SingleReview;
  */



/*
export async function generateStaticParams() {
  // Replace this with actual logic to fetch available track IDs
  const trackIds = ['03T4ttRCiLXST6MZjeMwmR', '0e6fZkLArSmDIHnZcIua7t', '789']; // Example static track IDs

  // Return all possible params for the dynamic route
  return trackIds.map((track_id) => ({ track_id }));
}

*/
