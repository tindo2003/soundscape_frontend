"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FriendsHeaderProps {
    onSearch: (query: string) => void;
}

export default function FriendsHeader({ onSearch }: FriendsHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Friends</h1>
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search friends..."
                        className="pl-8"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
} 