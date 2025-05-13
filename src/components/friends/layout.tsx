"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import FriendsHeader from "@/components/friends/FriendsHeader";
import FriendsList from "@/components/friends/FriendsList";
import FriendRecommendations from "@/components/friends/FriendRecommendations";
import { IncomingFriendRequests } from "@/components/friends/IncomingFriendRequests";
import { OutgoingFriendRequests } from "@/components/friends/OutgoingFriendRequests";
import { verifySession } from "@/app/auth/auth_server";
import React, { useEffect, useState } from "react";
import { getFriendRecs } from "@/api/api";
import { SoundscapeUser } from "@/types/index";
import {DJANGO_USER_ENDPOINT} from "@/config/defaults"

// Dummy Friend Data (Replace with API calls)
const dummyFriends = [
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
];

const dummyRecommendations = [
    { id: 4, name: "Dave", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Emma", avatar: "https://i.pravatar.cc/150?img=5" },
];

const Layout: React.FC<{ userId: string }> = ({ userId }) => {
    const [friends, setFriends] = useState(dummyFriends);
    const [recommendations, setRecommendations] = useState<SoundscapeUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [name, setName] = useState("");
    // Simulated API Fetch
    useEffect(() => {
        console.log("Fetching friends for user:", userId);
        // Replace with API calls if needed

        const getRecs = async () => {
          try {
            const data = await getFriendRecs(userId);
            console.log("Top recs:", data);
            setRecommendations(data);
          } catch (error) {
            console.error("Error fetching top recs:", error);
          }
        }

        async function fetchData() {
            const res = await fetch(`${DJANGO_USER_ENDPOINT}/get_name/`, {
                credentials: "include", // include cookies in the request
            });
            const data = await res.json();
            setName(data.name);
        }
        getRecs();
        fetchData();

    }, [userId]);

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Hello there, {name ? name.split(" ")[0] : "Guest"}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Find and connect with your friends!
                        </p>
                    </div>
                </div>
                <FriendsList friend={1} userId={userId} />
                <FriendsList friend={0} userId={userId}/>
                <IncomingFriendRequests />
                <OutgoingFriendRequests />
                <FriendsList friend={2} userId={userId}/>
                {/* <FriendRecommendations recommendations={recommendations} /> */}
            </main>
        </div>
    );
};

export default Layout;
