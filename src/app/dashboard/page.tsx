import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LastPlayed from "@/components/dashboard/LastPlayed";
import TopArtistsGrid from "@/components/dashboard/TopArtistsGrid";
import GenreStats from "@/components/dashboard/GenreStats";
import Recommendation from "@/components/dashboard/Recommendation";
import LogoutButton from "./logout-button";
import LogIntoSpotifyButton from "./log_into_spotify_button";
import { verifySession } from "@/app/auth/auth_server";

export default async function DashboardPage() {
    const session = await verifySession();
    const spotifyId = session.spotify_id; // assuming payload key is "spotifyid"
    
    return (
        <div className="p-8">
            <DashboardHeader />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="space-y-8">
                    {spotifyId ? (
                        <LastPlayed spotifyId={spotifyId} />
                    ) : (
                        <p>No Spotify connection</p>
                    )}
                </div>
                <div className="space-y-8">
                    {spotifyId ? (
                        <>
                            <TopArtistsGrid spotifyId={spotifyId} />
                            <GenreStats spotifyId={spotifyId} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-gray-700 mb-4">
                                You haven't connected your Spotify account.
                            </p>
                            <LogIntoSpotifyButton />
                        </div>
                    )}
                </div>
            </div>
            {spotifyId && <Recommendation spotifyId={spotifyId} />}
            <LogoutButton />
        </div>
    );
}