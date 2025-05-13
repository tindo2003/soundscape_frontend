export interface ConcertsFilters {
    distance: number;
    genre: string;
    artist: string;
    eventType: string;
    friendsAttending: boolean;
    favoriteArtistsOnly: boolean;
}

export interface Concert {
    id: string;
    eName: string;
    artist: string;
    venue: string;
    date: string;
    time: string;
    location: string;
    price: string;
    genres: string;
    imageUrl: string;
    eventUrl: string;
    attendingFriends: AttendingFriend[];
}

interface AttendingFriend {
    user_id: string;
    username: string;
    pfp: string | null;
}

export interface ConcertRec {
    id: string;
    eName: string;
    artists: string;
    venue: string;
    date: string;
    eventUrl: string;
    imageUrl: string;
    location: string;
    time: string;
    attendingFriends: AttendingFriend[];
    price: string;
    isAttending?: boolean;
}

export interface FilterOptions {
    keyword: string;
    distance: number;
    eventType: string;
    friendsGoingOnly: boolean;
}

export interface ConcertRecommendations {
    newEvents: Concert[];
}


