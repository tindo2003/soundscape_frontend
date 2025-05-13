import React, { useEffect, useState } from "react";
import  Profile  from "../../components/profile/profile";
import { verifySession } from "@/app/auth/auth_server";

async function ProfilePage() {

  const session = await verifySession();
  const spotifyId = session.spotify_id;

  if (!spotifyId) {
    return <div>Unauthorized.</div>;
  }

  return (
    <div className="p-8">
       <Profile spotifyId={spotifyId} editable={true} />
    </div>
  );
}

export default ProfilePage;