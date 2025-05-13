import { GetStaticProps, GetStaticPaths } from 'next';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from "react";
import  Layout  from "../../../components/reviews/singlelayout";
import { verifySession } from "@/app/auth/auth_server";
import Profile from "@/components/profile/profile";

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
  params: Promise<{user_id: string}>;
}) {
  const user_id = (await params).user_id;

  return (
    <div className="p-8">
      <Profile spotifyId={user_id} editable={false}/>
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
