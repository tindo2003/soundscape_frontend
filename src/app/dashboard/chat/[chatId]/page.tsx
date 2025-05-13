"use client";
import { use } from "react";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatWindowPage({ params }: { params: Promise<{ chatId: string }> }) {
    const resolvedParams = use(params);
    return (
        <div className="container mx-auto py-8">
            <ChatWindow chatId={parseInt(resolvedParams.chatId)} />
        </div>
    );
} 