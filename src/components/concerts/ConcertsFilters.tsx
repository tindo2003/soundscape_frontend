// ConcertsFilters.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterOptions } from "@/types/concerts";

interface ConcertsFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
}

export default function ConcertsFilters({
    onFilterChange,
}: ConcertsFiltersProps) {
    const [filters, setFilters] = useState<FilterOptions>({
        keyword: "",
        distance: 50,
        eventType: "all",
        friendsGoingOnly: false, // Initialize the new filter
    });

    const handleFilterChange = (
        key: keyof FilterOptions,
        value: string | number | boolean
    ) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters); 
    };

    return (
        <Card className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Filters</h3>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Search Artist or Event
                        </label>
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={filters.keyword}
                            onChange={(e) =>
                                handleFilterChange("keyword", e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Distance ({filters.distance} miles)
                        </label>
                        <Slider
                            value={[filters.distance]}
                            onValueChange={(value) =>
                                handleFilterChange("distance", value[0])
                            }
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0 miles</span>
                            <span>100 miles</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Event Type
                        </label>
                        <Select
                            value={filters.eventType}
                            onValueChange={(value) =>
                                handleFilterChange("eventType", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="concerts">
                                    Concerts
                                </SelectItem>
                                <SelectItem value="festivals">
                                    Festivals
                                </SelectItem>
                                <SelectItem value="tours">Tours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                            Friends Going Only
                        </label>
                        <Switch
                            checked={filters.friendsGoingOnly}
                            onCheckedChange={(checked) =>
                                handleFilterChange("friendsGoingOnly", checked)
                            }
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}
