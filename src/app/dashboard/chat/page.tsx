"use client";
import ChatList from "@/components/chat/ChatList";
import NewChatButton from "@/components/chat/NewChatButton";

export default function ChatPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Messages</h1>
                <NewChatButton />
            </div>
            <ChatList />
        </div>
    );
} 