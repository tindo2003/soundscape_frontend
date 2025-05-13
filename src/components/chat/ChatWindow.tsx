import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface Message {
    id: number;
    content: string;
    sender: {
        user_id: string;
        username: string;
        pfp: string | null;
    };
    created_at: string;
    is_read: boolean;
}

interface ChatWindowProps {
    chatId: number;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUsername, setCurrentUsername] = useState<string | null>(null);
    const [currentUserPfp, setCurrentUserPfp] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // Fetch current user info
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch(`${DJANGO_USER_ENDPOINT}/get-user-profile/`, {
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch user info");
                const data = await response.json();
                console.log("data", data)
                setCurrentUserId(data.user_id);
                setCurrentUsername(data.name);
                setCurrentUserPfp(data.pfp);
            } catch (e) {
                // fallback: leave as null
            }
        };
        fetchCurrentUser();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/chats/${chatId}/messages/`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }
            const data = await response.json();
            setMessages(data.messages);
            
            // Mark messages as read
            await fetch(
                `${DJANGO_USER_ENDPOINT}/chats/${chatId}/mark-read/`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        // Set up WebSocket connection
        const wsClient = new WebSocket(`ws://localhost:8001/ws/chat/${chatId}/`);
        
        wsClient.onopen = () => {
            console.log('WebSocket Connected');
        };

        wsClient.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
            
            // Mark messages as read
            fetch(
                `${DJANGO_USER_ENDPOINT}/chats/${chatId}/mark-read/`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );
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
    }, [chatId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!newMessage.trim() || !ws) return;

        ws.send(JSON.stringify({ message: newMessage }));
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col border rounded-lg shadow bg-white">
            <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Chat</h2>
            </div>
            <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => {
                    const isMe = message.sender.user_id === currentUserId;
                    return (
                        <div
                            key={message.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[70%] w-fit`}>
                                <div className={`text-xs text-muted-foreground mb-1 ${isMe ? "text-right" : "text-left"}`}>
                                    {isMe ? "You" : message.sender.username}
                                </div>
                                <div
                                    className={`rounded-lg p-3 break-words ${
                                        isMe
                                            ? "bg-primary text-primary-foreground text-right ml-auto"
                                            : "bg-muted text-left mr-auto"
                                    }`}
                                >
                                    <p>{message.content}</p>
                                </div>
                                <div className={`text-[10px] text-muted-foreground mt-1 ${isMe ? "text-right" : "text-left"}`}>
                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="px-6 py-4 border-t flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                <Button onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 