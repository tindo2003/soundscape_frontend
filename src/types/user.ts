export interface SoundscapeUser {
    id: string;
    user_id: string;
    profile: string;
    username: string;
    display_name: string;
    pfp: string;
    email: string;
}

export interface IncomingFriendRequest {
    id: string;
    sender_id: string;
    sender_display_name: string;
    status: string;
    created_at: string;
}

export interface OutgoingFriendRequest {
    id: string;
    receiver_id: string;
    receiver_display_name: string;
    status: string;
    created_at: string;
}

export interface Recommendation {
    id: string;
    track_name: string;
    artist_name: string;
}

export interface ConcertsListProps {
    filters: {
        date?: string;
        location?: string;
        genre?: string;
        distance?: number;
        keyword?: string;
        friendsGoingOnly?: boolean;
    };
} 

