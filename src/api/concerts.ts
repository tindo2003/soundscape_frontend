import axios from "axios";
import { DJANGO_RECOMMENDATIONS_ENDPOINT } from "../config/defaults";

export const searchConcerts = async (
  latitude: number,
  longitude: number,
  filters: {
    distance: number;
    genre?: string;
    artist?: string;
    eventType: string;
    friendsAttending: boolean;
    favoriteArtistsOnly: boolean;
  }
) => {
  try {
    const response = await axios.get(`${DJANGO_RECOMMENDATIONS_ENDPOINT}/concerts/search`, {
      params: {
        latitude,
        longitude,
        radius: filters.distance,
        genre: filters.genre,
        artist: filters.artist
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching concerts:', error);
    throw error;
  }
}; 