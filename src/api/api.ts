import axios from "axios";
import { DJANGO_USER_ENDPOINT, DJANGO_RECOMMENDATIONS_ENDPOINT } from "../config/defaults";

const API_BASE_URL = DJANGO_USER_ENDPOINT; // For user-related endpoints
const RECOMMENDATIONS_BASE_URL = DJANGO_RECOMMENDATIONS_ENDPOINT; // For recommendations endpoints

export const fetchSpotifyUser = async () => {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
};

export const fetchTopArtists = async (spotifyId: string) => {
    const response = await axios.post(`${API_BASE_URL}/top-artists/`, {
        spotifyId,
    });
    return response.data;
};

export const fetchTopGenres = async (spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/top-genres/`, {
        params: { spotifyId },
        withCredentials: true,
    });
    return response.data;
};

export const getFriendRecs = async (spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/friend-recs/`, {
        params: { spotifyId },
    });
    return response.data;
};

export const fetchRecommendations = async (spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/recommendations/`, {
        params: { spotifyId },
    });
    return response.data;
};

export const fetchTopTracks = async (spotifyId: string) => {
    const response = await axios.post(`${API_BASE_URL}/top-tracks/`, {
        spotifyId,
    });
    return response.data;
};

export const fetchSingleTrack = async (spotifyId: string, trackId: string) => {
    const response = await axios.get(`${API_BASE_URL}/fetch-single-track/`, {
        params: { spotifyId, trackId },
    });
    return response.data;
};

export const searchSongs = async (spotifyId: string, query: string) => {
    const response = await axios.get(`${API_BASE_URL}/search-songs/`, {
        params: { spotifyId, query },
    });
    return response.data;
};

export const fetchTopTracksSaved = async (
    spotifyId: string,
    version: string
) => {
    const response = await axios.get(
        `${API_BASE_URL}/top-songs-from-database/`,
        {
            params: { spotifyId, version },
        }
    );
    return response.data;
};

export const recentTracksSaved = async (spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/recently-listened/`, {
        params: { spotifyId },
    });
    return response.data;
};

export const getSoundscape = async (spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/get-user-profile/`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchSavedAlbums = async (spotifyId: string) => {
    const response = await axios.post(`${API_BASE_URL}/saved-albums/`, {
        spotifyId,
    });
    return response.data;
};

export const replaceSocialMedia = async (
    spotifyId: string,
    x: string,
    instagram: string,
    youtube: string
) => {
    const response = await axios.post(`${API_BASE_URL}/update-social-media/`, {
        spotifyId,
        x,
        instagram,
        youtube,
    });
    return response.data;
};

export const spotifyLogin = async () => {
    const response = await axios.get(`${API_BASE_URL}/login/`);
    return response.data;
};

// Fetch recommendations using association rules
export const fetchRecsUsingAssociationRules = async (userId: string) => {
    try {
        const response = await axios.get(
            `${RECOMMENDATIONS_BASE_URL}/ar/${userId}/`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching association rule recommendations: ${error}`
        );
        throw error;
    }
};

// Fetch recommendations using content-based filtering
export const fetchRecsContentBased = async (userId: string) => {
    try {
        const response = await axios.get(
            `${RECOMMENDATIONS_BASE_URL}/cb/user/${userId}/`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching content-based recommendations: ${error}`);
        throw error;
    }
};

export const fetchConcertRecs = async () => {
    try {
        const response = await axios.get(
            `${RECOMMENDATIONS_BASE_URL}/concerts_rec/`,
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching content-based recommendations: ${error}`);
        throw error;
    }
};

export const putSingleReview = async (
    track: string,
    user: string,
    text: string,
    rating: number,
    timestamp: string
) => {
    const response = await axios.post(`${API_BASE_URL}/add-single-review/`, {
        track,
        user,
        text,
        rating,
        timestamp,
    });
    return response.data;
};

export const getReviewsForSong = async (track: string, spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/get-review-by-song/`, {
        params: { track, spotifyId },
    });
    return response.data;
};

export const getReviewsForUser = async (spotifyId: string) => {
    const response = await axios.get(`${API_BASE_URL}/get-review-by-user/`, {
        params: { spotifyId },
    });
    return response.data;
};

// api.ts
export const searchConcerts = async (
    latitude: number,
    longitude: number,
    radius: number = 50,
    keyword?: string
) => {
    try {
        const response = await axios.get(
            `${RECOMMENDATIONS_BASE_URL}/concerts/search/`,
            {
                params: {
                    latitude,
                    longitude,
                    radius,
                    keyword: keyword || undefined, // Only include if not empty
                },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
        } else {
            console.error("Error fetching concerts:", error);
        }
        throw error;
    }
};
