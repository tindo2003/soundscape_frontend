"use client";

// components/MonthlyTop5GenresChart.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from "chart.js";
import { DJANGO_USER_ENDPOINT } from "@/config/defaults";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface GenreData {
    genre_id: number;
    genre_name: string;
    total_listens: number;
}

interface MonthlyData {
    month: string; // e.g., "2025-01"
    top5_genres: GenreData[]; // up to 5 items
}

export default function MonthlyTop5GenresChart(): JSX.Element {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

    useEffect(() => {
        axios
            .get<MonthlyData[]>(
                `${DJANGO_USER_ENDPOINT}/month-top5-genres/`,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                setMonthlyData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    if (!monthlyData.length) return <div>Loading...</div>;

    // 1. Extract a simple list of months for the X-axis labels
    const months = monthlyData.map((md) => md.month);

    // 2. We'll create five "rank" datasets (Rank 1 through Rank 5).
    //    Each dataset holds the bar values for that rank across all months.
    const RANK_COUNT = 5;
    const datasets = Array.from({ length: RANK_COUNT }, (_, rankIndex) => {
        // For each month, pick the genre at `rankIndex` (if it exists)
        const data = monthlyData.map(
            (md) => md.top5_genres[rankIndex]?.total_listens ?? 0
        );
        // We'll store the genre names for tooltip display
        const genreNames = monthlyData.map(
            (md) => md.top5_genres[rankIndex]?.genre_name ?? "N/A"
        );

        return {
            label: "", // Appears in the legend
            data,
            backgroundColor: "rgba(75,192,192,0.4)",
            // We attach genreNames as a custom property for the tooltip
            genreNames,
            // Bar spacing (you can tweak these to adjust closeness)
            barPercentage: 0.8,
            categoryPercentage: 0.8,
        };
    });

    // 3. Build the chart data object
    const chartData: ChartData<"bar"> = {
        labels: months, // X-axis: each label is a month
        datasets,
    };

    // 4. Define chart options
    const options: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    // Customize the tooltip to show the actual genre name
                    label: (context) => {
                        const datasetIndex = context.datasetIndex;
                        const dataIndex = context.dataIndex;
                        const dataset = context.chart.data.datasets[
                            datasetIndex
                        ] as any;
                        const genreName = dataset.genreNames[dataIndex];
                        const listens = context.parsed.y;
                        return `${genreName}: ${listens} listens`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: false,
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                beginAtZero: true,
                stacked: false,
                title: {
                    display: true,
                    text: "listen_counts",
                },
            },
        },
    };

    return (
        <div>
            <h2>Top 5 Genres for Each Month </h2>
            <Bar data={chartData} options={options} />
        </div>
    );
}
