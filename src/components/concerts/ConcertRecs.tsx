"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { fetchConcertRecs } from "@/api/api";
import { ConcertRec } from "@/types/concerts";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface ConcertWithAttendance extends ConcertRec {
    isAttending: boolean;
}

interface ConcertGroup {
    commonDetails: {
        eName: string;
        artists: string;
        imageUrl: string;
    };
    instances: ConcertWithAttendance[];
}

export default function ConcertRecList() {
    const [concerts, setConcerts] = useState<ConcertWithAttendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingAttendanceId, setLoadingAttendanceId] = useState<string | null>(null);

    const fetchConcerts = async () => {
        try {
            setLoading(true);
            const data = await fetchConcertRecs();
            console.log("fetchConcerts for recs", data);

            // Fetch attendance status for all concerts
            const attendanceResponse = await fetch(
                `${DJANGO_USER_ENDPOINT}/attending-concerts/`,
                { credentials: "include" }
            );
            const attendanceData = await attendanceResponse.json();

            // Combine concert data with attendance status
            const concertsWithAttendance = data.data.newEvents.map(
                (concert: ConcertRec) => ({
                    ...concert,
                    isAttending: attendanceData.attending_concerts.includes(
                        concert.id
                    ),
                })
            );

            setConcerts(concertsWithAttendance);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch concerts");
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

    const concertGroups = useMemo(() => {
        if (!concerts || concerts.length === 0) return [];

        const groups: Record<string, ConcertGroup> = concerts.reduce(
            (acc, concert) => {
                const key = concert.eName;
                if (!acc[key]) {
                    acc[key] = {
                        commonDetails: {
                            eName: concert.eName,
                            artists: concert.artists,
                            imageUrl: concert.imageUrl,
                        },
                        instances: [],
                    };
                }
                acc[key].instances.push(concert);
                return acc;
            },
            {} as Record<string, ConcertGroup>
        );

        Object.values(groups).forEach((group) => {
            group.instances.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        });

        return Object.values(groups);
    }, [concerts]);

    useEffect(() => {
        fetchConcerts();
    }, []);

    if (loading) return <div>Loading concerts...</div>;
    if (error) return <div>{error}</div>;

    if (concertGroups.length === 0)
        return <div className="p-4 text-center">No concert recommendations found.</div>;

    return (
        <div className="space-y-8 p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Your Concert Recommendations
            </h1>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 space-y-8">
                {concertGroups.map((group) => (
                    <Card key={group.commonDetails.eName} className="overflow-hidden shadow-lg">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <img
                                    src={group.commonDetails.imageUrl}
                                    alt={group.commonDetails.eName}
                                    className="h-48 w-full object-cover md:w-48 md:h-full"
                                />
                            </div>
                            <div className="p-6 flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-semibold leading-tight">
                                        {group.commonDetails.eName}
                                    </h2>
                                    <p className="text-md text-muted-foreground">
                                        Artists: {group.commonDetails.artists}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {group.instances.map(
                                        (concertInstance, index) => (
                                            <div
                                                key={concertInstance.id}
                                                className={`pt-4 ${
                                                    index > 0
                                                        ? "border-t border-border mt-4"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                                    <div className="flex-grow space-y-1.5">
                                                        <p className="text-lg font-medium text-card-foreground">
                                                            {concertInstance.venue}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4 flex-shrink-0" />
                                                            <span>
                                                                {new Date(
                                                                    concertInstance.date
                                                                ).toLocaleDateString(
                                                                    undefined,
                                                                    {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    }
                                                                )}{" "}
                                                                at{" "}
                                                                {concertInstance.time}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <MapPin className="h-4 w-4 flex-shrink-0" />
                                                            <span
                                                                className="cursor-pointer hover:underline"
                                                                onClick={() =>
                                                                    window.open(
                                                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                                            `${concertInstance.venue} ${concertInstance.location}`
                                                                        )}`,
                                                                        "_blank"
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    concertInstance.location
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 sm:items-end flex-shrink-0 w-full sm:w-auto">
                                                        <Button
                                                            onClick={() =>
                                                                window.open(
                                                                    concertInstance.eventUrl,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="w-full sm:w-auto"
                                                        >
                                                            Get Tickets
                                                        </Button>
                                                        <Button
                                                            variant={
                                                                concertInstance.isAttending
                                                                    ? "secondary"
                                                                    : "outline"
                                                            }
                                                            onClick={() =>
                                                                toggleAttendance(
                                                                    concertInstance.id
                                                                )
                                                            }
                                                            disabled={
                                                                loadingAttendanceId ===
                                                                concertInstance.id
                                                            }
                                                            className="w-full sm:w-auto"
                                                        >
                                                            {loadingAttendanceId ===
                                                            concertInstance.id
                                                                ? "Updating..."
                                                                : concertInstance.isAttending
                                                                ? "Going ✓"
                                                                : "Mark as Going"}
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                    <HoverCard>
                                                        <HoverCardTrigger
                                                            asChild
                                                        >
                                                            <div className={`flex items-center gap-2 text-sm text-muted-foreground ${concertInstance.attendingFriends.length > 0 ? 'cursor-pointer hover:text-foreground' : 'cursor-default'}`}>
                                                                <Users className="h-4 w-4 flex-shrink-0" />
                                                                <span>
                                                                    {concertInstance
                                                                        .attendingFriends
                                                                        .length}{" "}
                                                                    friend
                                                                    {concertInstance
                                                                        .attendingFriends
                                                                        .length !== 1
                                                                        ? "s"
                                                                        : ""}{" "}
                                                                    going
                                                                </span>
                                                                {concertInstance
                                                                    .attendingFriends
                                                                    .length > 0 && (
                                                                    <div className="flex -space-x-1 overflow-hidden ml-1">
                                                                        {concertInstance.attendingFriends
                                                                            .slice(
                                                                                0,
                                                                                3
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    friend
                                                                                ) => (
                                                                                    <img
                                                                                        key={
                                                                                            friend.user_id
                                                                                        }
                                                                                        src={
                                                                                            friend.pfp ||
                                                                                            "/default-avatar.png" // Ensure this path is correct
                                                                                        }
                                                                                        alt={
                                                                                            friend.username
                                                                                        }
                                                                                        className="inline-block h-5 w-5 rounded-full ring-1 ring-background"
                                                                                        title={friend.username}
                                                                                    />
                                                                                )
                                                                            )}
                                                                        {concertInstance
                                                                            .attendingFriends
                                                                            .length >
                                                                            3 && (
                                                                            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-muted-foreground text-xs font-medium ring-1 ring-background">
                                                                                +
                                                                                {concertInstance
                                                                                    .attendingFriends
                                                                                    .length -
                                                                                    3}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </HoverCardTrigger>
                                                        {concertInstance.attendingFriends.length > 0 && (
                                                        <HoverCardContent className="w-auto min-w-[200px] max-w-xs">
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold">
                                                                    Friends attending
                                                                    this date
                                                                </h4>
                                                                <div className="space-y-1.5">
                                                                    {concertInstance.attendingFriends.map(
                                                                        (friend) => (
                                                                            <div
                                                                                key={
                                                                                    friend.user_id
                                                                                }
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
                                                                                <span className="text-sm font-medium">
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
                                                        )}
                                                    </HoverCard>
                                                    <div className="text-sm text-muted-foreground">
                                                        Starting from{" "}
                                                        <span className="font-semibold text-card-foreground">
                                                            {concertInstance.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
