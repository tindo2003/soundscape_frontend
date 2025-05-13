import React, { useState, useEffect } from "react";
import axios from "axios";
import { OutgoingFriendRequest } from "@/types/user";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";



export const OutgoingFriendRequests: React.FC = () => {
    const [outgoingRequests, setOutgoingRequests] = useState<
        OutgoingFriendRequest[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchOutgoing() {
            try {
                const response = await axios.get<OutgoingFriendRequest[]>(
                    `${DJANGO_USER_ENDPOINT}/friend-requests/outgoing/`,
                    { withCredentials: true }
                );
                setOutgoingRequests(response.data);
            } catch (err) {
                console.error(err);
                setError("Error fetching outgoing friend requests.");
            } finally {
                setLoading(false);
            }
        }
        fetchOutgoing();
    }, []);

    const handleCancel = async (requestId: string) => {
        try {
            await axios.post(
                `${DJANGO_USER_ENDPOINT}/friend-requests/cancel/${requestId}/`,
                {},
                { withCredentials: true }
            );
            setOutgoingRequests(
                outgoingRequests.filter((req) => req.id !== requestId)
            );
        } catch (err) {
            console.error("Error cancelling request:", err);
        }
    };

    if (loading) return <p>Loading outgoing friend requests...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">
                Outgoing Friend Requests
            </h2>
            {outgoingRequests.length === 0 ? (
                <p className="text-gray-500">No outgoing friend requests.</p>
            ) : (
                <div className="space-y-4">
                    {outgoingRequests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    To: {req.receiver_display_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(req.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleCancel(req.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
