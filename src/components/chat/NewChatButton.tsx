import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

interface User {
    user_id: string;
    username: string;
    pfp: string | null;
}

export default function NewChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchUsers = async (query: string) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${DJANGO_USER_ENDPOINT}/search/?query=${encodeURIComponent(query)}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) throw new Error("Failed to search users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (userId: string) => {
        try {
            const response = await fetch(`${DJANGO_USER_ENDPOINT}/chats/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ participant_id: userId }),
            });

            if (!response.ok) throw new Error("Failed to create chat");
            const data = await response.json();
            
            // Close the dialog and navigate to the new chat
            setIsOpen(false);
            router.push(`/dashboard/chat/${data.chat_id}`);
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>New Chat</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start a New Chat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchUsers(e.target.value);
                        }}
                    />
                    <div className="space-y-2">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user.user_id}
                                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer"
                                    onClick={() => startChat(user.user_id)}
                                >
                                    {user.pfp && (
                                        <img
                                            src={user.pfp}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span>{user.username}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 