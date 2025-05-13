import React, { useState, useEffect } from "react";
import axios from "axios";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";
import { IncomingFriendRequest } from "@/types/user";


export const IncomingFriendRequests: React.FC = () => {
    const [incomingRequests, setIncomingRequests] = useState<
        IncomingFriendRequest[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchIncoming() {
            try {
                const response = await axios.get<IncomingFriendRequest[]>(
                    `${DJANGO_USER_ENDPOINT}/friend-requests/incoming/`,
                    { withCredentials: true }
                );
                setIncomingRequests(response.data);
            } catch (err) {
                console.error(err);
                setError("Error fetching incoming friend requests.");
            } finally {
                setLoading(false);
            }
        }
        fetchIncoming();
    }, []);

    const handleAccept = async (requestId: string) => {
        try {
            await axios.post(
                `${DJANGO_USER_ENDPOINT}/friend-requests/accept/${requestId}/`,
                {},
                { withCredentials: true }
            );
            setIncomingRequests(
                incomingRequests.filter((req) => req.id !== requestId)
            );
        } catch (err) {
            console.error("Error accepting request:", err);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            await axios.post(
                `${DJANGO_USER_ENDPOINT}/friend-requests/reject/${requestId}/`,
                {},
                { withCredentials: true }
            );
            setIncomingRequests(
                incomingRequests.filter((req) => req.id !== requestId)
            );
        } catch (err) {
            console.error("Error rejecting request:", err);
        }
    };

    if (loading) return <p>Loading incoming friend requests...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">
                Incoming Friend Requests
            </h2>
            {incomingRequests.length === 0 ? (
                <p className="text-gray-500">No incoming friend requests.</p>
            ) : (
                <div className="space-y-4">
                    {incomingRequests.map((req) => (
                        <div
                            key={req.id}
                            className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    From: {req.sender_display_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(req.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleAccept(req.id)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(req.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
