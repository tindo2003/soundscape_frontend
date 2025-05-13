// ConcertsList.tsx
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { searchConcerts } from "@/api/api";
import { Concert, FilterOptions } from "@/types/concerts";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";
import { ConcertsListProps } from "@/types/user";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConcertWithAttendance extends Concert {
    isAttending?: boolean;
}

interface Friend {
    id: string; // spotify_id
    display_name: string;
    soundscape_id: string;
}

interface InviteStatus {
    concertId: string;
    friendId: string;
    status: "pending" | "success" | "error";
    message?: string;
}

export default function ConcertsList({ filters }: ConcertsListProps) {
    const [concerts, setConcerts] = useState<ConcertWithAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingAttendanceId, setLoadingAttendanceId] = useState<
        string | null
    >(null);

    const [friends, setFriends] = useState<Friend[]>([]);
    const [inviteStatus, setInviteStatus] = useState<InviteStatus | null>(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch(
                    `${DJANGO_USER_ENDPOINT}/friends/`,
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                console.log("[concert list] get friends data", data);
                setFriends(data);
            } catch (error) {
                console.error("Error fetching friends:", error);
            }
        };

        fetchFriends();
    }, []);

    const handleInviteFriend = async (concertId: string, friend: Friend) => {
        setInviteStatus({
            concertId,
            friendId: friend.id,
            status: "pending",
        });

        const concert = concerts.find((c) => c.id === concertId);
        if (!concert) return;

        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/invite-friend-to-concert/`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        friend_id: friend.soundscape_id, // Using the soundscape_id directly
                        concert_id: concertId,
                        concert_name: concert.artist,
                        event_url: concert.eventUrl,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send invitation");
            }

            setInviteStatus({
                concertId,
                friendId: friend.id,
                status: "success",
                message: "Invitation sent!",
            });

            setTimeout(() => {
                setInviteStatus(null);
            }, 3000);
        } catch (error) {
            console.error("Error inviting friend:", error);
            setInviteStatus({
                concertId,
                friendId: friend.id,
                status: "error",
                message: "Failed to send invitation",
            });

            setTimeout(() => {
                setInviteStatus(null);
            }, 3000);
        }
    };

    const InviteFriendsDropdown = ({
        concert,
        friends,
        onInvite,
    }: {
        concert: Concert;
        friends: Friend[];
        onInvite: (friend: Friend) => void;
    }) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        Invite Friends
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <DropdownMenuItem
                                key={friend.id}
                                onClick={() => onInvite(friend)}
                                disabled={
                                    inviteStatus?.friendId === friend.id &&
                                    inviteStatus?.status === "pending"
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <span>{friend.display_name}</span>
                                    {inviteStatus &&
                                        inviteStatus.friendId === friend.id && (
                                            <span
                                                className={`ml-2 text-sm ${
                                                    inviteStatus.status ===
                                                    "pending"
                                                        ? "text-yellow-500"
                                                        : inviteStatus.status ===
                                                          "success"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }`}
                                            >
                                                {inviteStatus.status ===
                                                "pending"
                                                    ? "..."
                                                    : inviteStatus.status ===
                                                      "success"
                                                    ? "✓"
                                                    : "✗"}
                                            </span>
                                        )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuItem disabled>
                            No friends to invite
                        </DropdownMenuItem>
                    )}
                    {inviteStatus && inviteStatus.message && (
                        <div
                            className={`px-2 py-1 text-sm ${
                                inviteStatus.status === "success"
                                    ? "text-green-500"
                                    : inviteStatus.status === "error"
                                    ? "text-red-500"
                                    : "text-yellow-500"
                            }`}
                        >
                            {inviteStatus.message}
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const fetchConcerts = async () => {
        try {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const data = await searchConcerts(
                        latitude,
                        longitude,
                        filters.distance,
                        filters.keyword
                    );

                    // Fetch attendance status for all concerts
                    const attendanceResponse = await fetch(
                        `${DJANGO_USER_ENDPOINT}/attending-concerts/`,
                        { credentials: "include" }
                    );
                    const attendanceData = await attendanceResponse.json();

                    // Combine concert data with attendance status
                    const concertsWithAttendance = data.map(
                        (concert: Concert) => ({
                            ...concert,
                            isAttending:
                                attendanceData.attending_concerts.includes(
                                    concert.id
                                ),
                        })
                    );

                    setConcerts(concertsWithAttendance);
                },
                (error) => {
                    // Default to New York coordinates if geolocation fails
                    console.error("Geolocation error:", error);
                    searchConcerts(
                        40.7128,
                        -74.006,
                        filters.distance,
                        filters.keyword
                    ).then(async (data) => {
                        // Fetch attendance status
                        const attendanceResponse = await fetch(
                            `${DJANGO_USER_ENDPOINT}/attending-concerts/`,
                            { credentials: "include" }
                        );
                        const attendanceData = await attendanceResponse.json();

                        const concertsWithAttendance = data.map(
                            (concert: Concert) => ({
                                ...concert,
                                isAttending:
                                    attendanceData.attending_concerts.includes(
                                        concert.id
                                    ),
                            })
                        );
                        setConcerts(concertsWithAttendance);
                    });
                }
            );
        } catch (err) {
            setError("Failed to fetch concerts");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAttendance = async (concertId: string) => {
        setLoadingAttendanceId(concertId);
        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/toggle-attendance/`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ concert_id: concertId }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to toggle attendance");
            }

            const data = await response.json();

            // Update the concerts state with the new attendance status
            setConcerts((prevConcerts) =>
                prevConcerts.map((concert) =>
                    concert.id === concertId
                        ? {
                              ...concert,
                              isAttending: data.status === "attending",
                          }
                        : concert
                )
            );
        } catch (error) {
            console.error("Error toggling attendance:", error);
        } finally {
            setLoadingAttendanceId(null);
        }
    };

    useEffect(() => {
        fetchConcerts();
    }, [filters]); // Re-fetch when filters change

    if (loading) return <div>Loading concerts...</div>;
    if (error) return <div>{error}</div>;

    const filteredConcerts = concerts.filter((concert) => {
        // If friendsGoingOnly is true, only show concerts with friends attending
        if (filters.friendsGoingOnly && concert.attendingFriends.length === 0) {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-4">
            {filteredConcerts.map((concert) => (
                <Card key={concert.id} className="p-6">
                    <div className="flex gap-6">
                        <img
                            src={concert.imageUrl}
                            alt={concert.artist}
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {concert.artist}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {concert.venue}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() =>
                                            window.open(
                                                concert.eventUrl,
                                                "_blank"
                                            )
                                        }
                                    >
                                        Get Tickets
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            window.open(
                                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    concert.venue +
                                                        " " +
                                                        concert.location
                                                )}`,
                                                "_blank"
                                            )
                                        }
                                    >
                                        Open in Google Maps
                                    </Button>
                                    <Button
                                        variant={
                                            concert.isAttending
                                                ? "secondary"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            toggleAttendance(concert.id)
                                        }
                                        disabled={
                                            loadingAttendanceId === concert.id
                                        }
                                    >
                                        {loadingAttendanceId === concert.id
                                            ? "Updating..."
                                            : concert.isAttending
                                            ? "Going ✓"
                                            : "Going"}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(
                                            concert.date
                                        ).toLocaleDateString()}{" "}
                                        at {concert.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{concert.location}</span>
                                </div>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <Users className="h-4 w-4" />
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {
                                                        concert.attendingFriends
                                                            .length
                                                    }{" "}
                                                    friends going
                                                </span>
                                                {concert.attendingFriends
                                                    .length > 0 && (
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {concert.attendingFriends
                                                            .slice(0, 3)
                                                            .map((friend) => (
                                                                <img
                                                                    key={
                                                                        friend.user_id
                                                                    }
                                                                    src={
                                                                        friend.pfp ||
                                                                        "/default-avatar.png"
                                                                    }
                                                                    alt={
                                                                        friend.username
                                                                    }
                                                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                                                />
                                                            ))}
                                                        {concert
                                                            .attendingFriends
                                                            .length > 3 && (
                                                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-xs font-medium text-gray-800 ring-2 ring-white">
                                                                +
                                                                {concert
                                                                    .attendingFriends
                                                                    .length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">
                                                Friends attending
                                            </h4>
                                            <div className="space-y-1">
                                                {concert.attendingFriends.map(
                                                    (friend) => (
                                                        <div
                                                            key={friend.user_id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <img
                                                                src={
                                                                    friend.pfp ||
                                                                    "/default-avatar.png"
                                                                }
                                                                alt={
                                                                    friend.username
                                                                }
                                                                className="h-6 w-6 rounded-full"
                                                            />
                                                            <span className="text-sm">
                                                                {
                                                                    friend.username
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>

                            <div className="text-sm">
                                Starting from{" "}
                                <span className="font-semibold">
                                    {concert.price}
                                </span>
                            </div>
                        </div>
                    </div>

                    <InviteFriendsDropdown
                        concert={concert}
                        friends={friends.filter(
                            (friend) =>
                                !concert.attendingFriends.some(
                                    (af) => af.user_id === friend.soundscape_id
                                )
                        )}
                        onInvite={(friend) =>
                            handleInviteFriend(concert.id, friend)
                        }
                    />
                </Card>
            ))}
        </div>
    );
}
