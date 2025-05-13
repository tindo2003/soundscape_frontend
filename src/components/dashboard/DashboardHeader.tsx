"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

export default function DashboardHeader() {
    const [name, setName] = useState("");
    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`${DJANGO_USER_ENDPOINT}/get_name/`, {
                credentials: "include", // include cookies in the request
            });
            const data = await res.json();
            setName(data.name);
        }

        fetchData();
    }, []);
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold">
                    Hello there, {name? name.split(" ")[0] : "Guest"}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here's what we've built for you today...
                </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Customize home
            </Button>
        </div>
    );
}
