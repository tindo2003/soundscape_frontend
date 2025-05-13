"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getFriendRecs } from "@/api/api";
import { SoundscapeUser } from "@/types/user";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface InputProp {
    friend: number;
    userId: string;
}

const FriendsList: React.FC<InputProp> = ({ friend, userId }) => {
    const [friends, setFriends] = useState<SoundscapeUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFriends, setFilteredFriends] = useState<SoundscapeUser[]>(
        []
    );
    const [requestStatus, setRequestStatus] = useState<Record<string, string>>(
        {}
    );
    const [requestErrors, setRequestErrors] = useState<Record<string, string>>(
        {}
    );
    const [existingFriendIds, setExistingFriendIds] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                let url = "";
                // If `friend` is true, we call the /friends endpoint
                // Otherwise, we call /all-users to enable searching
                if (friend === 0) {
                    url = `${DJANGO_USER_ENDPOINT}/friends/`;
                } else if (friend === 1) {
                    url = `${DJANGO_USER_ENDPOINT}/all-users/`;
                }
                if (friend === 0 || friend === 1) {
                    const response = await fetch(url, {
                        credentials: "include",
                    });
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }

                    const data = await response.json();
                    console.log("Fetched data:", data);
                    setFriends(data);
                    setFilteredFriends(data);
                } else {
                    try {
                        const data = await getFriendRecs(userId);
                        console.log("Top recs:", data);
                        setFriends(data);
                        setFilteredFriends(data);
                    } catch (error) {
                        console.error("Error fetching top recs:", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [friend]);

    useEffect(() => {
        async function fetchFriendList() {
            try {
                const response = await fetch(
                    `${DJANGO_USER_ENDPOINT}/friends/`,
                    {
                        credentials: "include",
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                // Assume data is an array of friend objects with an "id" field
                const friendIds = data.map(
                    (friend: { id: string }) => friend.id
                );
                setExistingFriendIds(friendIds);
                console.log("Existing friend IDs:", friendIds);
            } catch (error) {
                console.error("Error fetching friend list:", error);
            }
        }
        if (friend === 0) {
            fetchFriendList();
        }
    }, [friend]);

    const handleAddFriend = async (receiverProfile: string) => {
        try {
            setRequestStatus((prev) => ({
                ...prev,
                [receiverProfile]: "loading",
            }));
            setRequestErrors((prev) => ({ ...prev, [receiverProfile]: "" }));

            const response = await axios.post(
                `${DJANGO_USER_ENDPOINT}/friend-requests/send/`,
                { receiver_id: receiverProfile },
                { withCredentials: true }
            );
            console.log(response.data);
            setRequestStatus((prev) => ({
                ...prev,
                [receiverProfile]: "sent",
            }));
        } catch (error: any) {
            console.error(error);
            setRequestStatus((prev) => ({
                ...prev,
                [receiverProfile]: "error",
            }));
            // Display error message if available
            const message =
                error.response?.data?.error ||
                "An error occurred. Please try again.";
            setRequestErrors((prev) => ({
                ...prev,
                [receiverProfile]: message,
            }));
        }
    };

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            setFilteredFriends(friends);
            return;
        }

        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/search/?query=${query}`
            );
            if (!response.ok) {
                throw new Error("Search failed.");
            }
            const results = await response.json();
            setFilteredFriends(results);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">
                {friend === 1
                    ? "Search Users"
                    : friend === 0
                    ? "Your Friends"
                    : "Friend Recommendations"}
            </h2>

            {/* Show search bar only if we're not in the "friends" view */}
            {friend === 1 && (
                <input
                    type="text"
                    placeholder="Search here. . ."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-[40%] md:w-[30%] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                />
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredFriends.length === 0 ? (
                            <p className="text-gray-500">
                                {friend === 0
                                    ? "You currently have no friends."
                                    : "No users found."}
                            </p>
                        ) : (
                            filteredFriends.map((user, index) => {
                                // Check if the current user is already a friend.
                                const alreadyFriend =
                                    existingFriendIds.includes(user.profile);

                                return (
                                    <div
                                        key={user.user_id || index}
                                        className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
                                    >
                                        <a
                                            href={`/profile/${
                                                user.profile || user.id
                                            }`}
                                        >
                                            <img
                                                src={
                                                    user.pfp
                                                        ? user.pfp
                                                        : "/images/defaults/default.webp"
                                                }
                                                alt="Profile Picture"
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        </a>
                                        <p className="mt-3 text-lg font-medium">
                                            {user.username ||
                                                user.display_name ||
                                                "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>

                                        {/* Show Add Friend button only if in search view and friend recs */}
                                        {(friend === 1 || friend === 2) && (
                                            <>
                                                {alreadyFriend ? (
                                                    <button
                                                        className="mt-4 px-4 py-2 bg-gray-400 text-white rounded opacity-50 cursor-not-allowed"
                                                        disabled
                                                    >
                                                        Already Friends
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleAddFriend(
                                                                user.profile
                                                            )
                                                        }
                                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                        disabled={
                                                            requestStatus[
                                                                user.profile
                                                            ] === "loading"
                                                        }
                                                    >
                                                        {requestStatus[
                                                            user.profile
                                                        ] === "sent"
                                                            ? "Request Sent"
                                                            : requestStatus[
                                                                  user.profile
                                                              ] === "loading"
                                                            ? "Sending..."
                                                            : "Add Friend"}
                                                    </button>
                                                )}
                                                {requestStatus[user.profile] ===
                                                    "error" && (
                                                    <p className="text-red-500 mt-2">
                                                        {
                                                            requestErrors[
                                                                user.profile
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendsList;
