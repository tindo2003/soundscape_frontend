// components/notifications/NotificationsList.tsx
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface Notification {
    id: number;
    type: string;
    sender: {
        user_id: string;
        username: string;
        pfp: string | null;
    };
    concert_id: string;
    concert_name: string;
    event_url: string;
    created_at: string;
    is_read: boolean;
}

export default function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/notifications/`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setError("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchNotifications();

        // Set up WebSocket connection
        const wsClient = new WebSocket('ws://localhost:8001/ws/notifications/');
        
        wsClient.onopen = () => {
            console.log('WebSocket Connected');
        };

        wsClient.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            setNotifications(prev => [notification, ...prev]);
        };

        wsClient.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        wsClient.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        setWs(wsClient);

        // Cleanup on unmount
        return () => {
            if (wsClient) {
                wsClient.close();
            }
        };
    }, []);

    const markAsRead = async (notificationId: number) => {
        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/mark-notification-read/`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ notification_id: notificationId }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to mark notification as read");
            }

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (notificationId: number) => {
        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/notifications/${notificationId}/`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete notification");
            }

            setNotifications((prev) =>
                prev.filter((notification) => notification.id !== notificationId)
            );
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    if (loading) return <div>Loading notifications...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Your recent notifications and updates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {notifications.length === 0 ? (
                        <div className="text-center text-muted-foreground">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border ${
                                        notification.is_read
                                            ? "bg-background"
                                            : "bg-muted"
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {notification.sender.pfp && (
                                            <img
                                                src={notification.sender.pfp}
                                                alt={notification.sender.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">
                                                        {notification.sender.username}{" "}
                                                        {notification.type === "concert_invite" &&
                                                            "invited you to a concert"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {notification.concert_name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            notification.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-xs text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                {notification.type === "concert_invite" && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (notification.event_url) {
                                                                    window.open(
                                                                        notification.event_url,
                                                                        "_blank"
                                                                    );
                                                                }
                                                            }}
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            View Concert
                                                        </button>
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification.id);
                                                                }}
                                                                className="text-sm text-muted-foreground hover:underline"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
