import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface Chat {
    id: number;
    participant: {
        user_id: string;
        username: string;
        pfp: string | null;
    };
    last_message: {
        content: string | null;
        created_at: string | null;
        sender_id: string | null;
    };
    updated_at: string;
}

export default function ChatList() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchChats = async () => {
        try {
            const response = await fetch(`${DJANGO_USER_ENDPOINT}/chats/`, {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch chats");
            }
            const data = await response.json();
            setChats(data.chats);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setError("Failed to load chats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    if (loading) return <div>Loading chats...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
                {chats.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        No messages yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="p-4 rounded-lg border hover:bg-muted cursor-pointer"
                                onClick={() => router.push(`/dashboard/chat/${chat.id}`)}
                            >
                                <div className="flex items-start gap-4">
                                    {chat.participant.pfp && (
                                        <img
                                            src={chat.participant.pfp}
                                            alt={chat.participant.username}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">
                                                    {chat.participant.username}
                                                </p>
                                                {chat.last_message.content && (
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {chat.last_message.content}
                                                    </p>
                                                )}
                                            </div>
                                            {chat.last_message.created_at && (
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        chat.last_message.created_at
                                                    ).toLocaleDateString()}
                                                </span>
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
    );
} 