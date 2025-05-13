// page.tsx
"use client";

import { useState } from "react";
import ConcertsHeader from "@/components/concerts/ConcertsHeader";
import ConcertsList from "@/components/concerts/ConcertsList";
import ConcertsFilters from "@/components/concerts/ConcertsFilters";
import ConcertRecList from "@/components/concerts/ConcertRecs";

interface FilterOptions {
    keyword: string;
    distance: number;
    eventType: string;
}

export default function ConcertsPage() {
    const [filters, setFilters] = useState<FilterOptions>({
        keyword: "",
        distance: 50,
        eventType: "all",
    });

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    return (
        <div className="p-8 space-y-8">
            <ConcertRecList />
            <ConcertsHeader />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <ConcertsFilters onFilterChange={handleFilterChange} />
                </div>
                <div className="lg:col-span-3">
                    <ConcertsList filters={filters} />
                </div>
            </div>
        </div>
    );
}
