"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewsHeader() {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold">Hello there, Tin</h1>
                <p className="text-muted-foreground mt-1">
                    Check out song reviews!
                </p>
                <div className="mt-8">
                <input
                  type="text"
                  placeholder="Search for a review"
                  className="w-[300%] md:w-[150%] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                </div>
            </div>
        </div>
    );
}
