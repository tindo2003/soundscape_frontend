export interface Artist {
  artist_id: string; // Matches the `id` field in the model
  href: string; // Matches the `href` field in the model
  type: string; // Matches the `type` field in the model
  uri: string; // Matches the `uri` field in the model
  external_urls: { [key: string]: string }; // Matches the `external_urls` JSONField
  name: string; // Matches the `name` field in the model
  followers: number; // Matches the `followers` IntegerField
  genres: string[]; // Matches the `genres` JSONField (array of strings)
  images: Array<{ url: string; height: number; width: number }>; // Matches the `images` JSONField
  popularity: number; // Matches the `popularity` field in the model
}

export interface Track {
  track_id: string;
  name: string;
  album: Album;
  disc_number: number;
  track_number: number;
  duration_ms: number;
  explicit: boolean;
  href: string;
  spotify_url: string;
  uri: string;
  preview_url: string | null;
  popularity: number;
  is_playable: boolean;
  is_local: boolean;
  art: string;
  artists: Artist[];
  external_urls: { [key: string]: string }; // Dictionary of strings
}

export interface User {
  display_name: string;
  email: string;
  country: string;
  followers_count: number;
  product: string;
  uri: string;
}

export interface UserTopArtist {
  artist: Artist;
  time_range: string;
  rank: number;
}

export interface UserTopTrack {
  track: Track;
  time_range: string;
  rank: number;
}

export interface Album {
  album_id: string;
  name: string;
  href: string;
  art: string;
  images: Array<{ url: string; height: string; width: string }>;
}

export interface SoundscapeUser {
    name: string;
    profile_id: string;
    email: string;
    art: string;
    timestamp: Date;
    pfp: string;
    x: string;
    instagram: string;
    youtube: string;
    forgotPasswordToken: string;
    forgotPasswordTokenExpiry: Date;
    verifyToken: string;
    verifyTokenExpiry: Date;
}

export interface UserSavedAlbums {
  album: Album;
  user: User;
  type: string;
  spotify_url: string;
  popularity: number;
}


export interface Review {
  un_id: string;
  track: Track;
  user: User;
  text: string;
  rating: number;
  timestamp: Date;
}
