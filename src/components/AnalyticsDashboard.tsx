"use client";

import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import {
    Users,
    Eye,
    Globe,
    TrendingUp,
    Clock,
    MousePointer,
    BarChart3,
    Activity,
} from "lucide-react";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";

interface AnalyticsData {
    totalViews: number;
    uniqueVisitors: number;
    topCountries: { country: string; count: number }[];
    topPages: { page: string; count: number }[];
    deviceBreakdown: { device: string; count: number }[];
    avgDuration: number;
    recentVisitors: any[];
    projectViews: { project_id: string; count: number }[];
}

export default function AnalyticsDashboard() {
    const { isDarkMode } = useStore();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
        "7d"
    );

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            // Get the auth token from Supabase
            const { supabase } = await import("@/lib/supabase");
            const { data: { session } } = await supabase.auth.getSession();

            const headers: HeadersInit = {};
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const response = await fetch(`/api/analytics?range=${timeRange}`, {
                headers,
                credentials: "include", // Include cookies
            });

            if (!response.ok) {
                console.error("Analytics fetch failed:", response.status, response.statusText);
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error(`Failed to fetch analytics: ${response.statusText}`);
            }

            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            // Set empty analytics data to prevent errors
            setAnalytics({
                totalViews: 0,
                uniqueVisitors: 0,
                topCountries: [],
                topPages: [],
                deviceBreakdown: [],
                avgDuration: 0,
                recentVisitors: [],
                projectViews: [],
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={isDarkMode ? "text-white" : "text-gray-900"}>
                        Loading analytics...
                    </p>
                </div>
            </div>
        );
    }

    if (!analytics || (analytics.totalViews === 0 && analytics.topCountries.length === 0)) {
        return (
            <div className="text-center py-12">
                <div className={`max-w-md mx-auto p-8 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                    <p className={`text-lg mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        No analytics data yet
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Analytics will appear here once you:
                    </p>
                    <ol className={`text-sm mt-4 space-y-2 text-left ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <li>1. Run the SQL migration in Supabase</li>
                        <li>2. Visit some pages on your site</li>
                        <li>3. Wait a few seconds for data to sync</li>
                    </ol>
                </div>
            </div>
        );
    }

    const StatCard = ({
        icon: Icon,
        title,
        value,
        subtitle,
        color,
    }: {
        icon: any;
        title: string;
        value: string | number;
        subtitle?: string;
        color: string;
    }) => (
        <BackgroundGradient className="rounded-[22px] p-1">
            <div
                className={`p-6 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                    }`}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p
                            className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            {title}
                        </p>
                        <p
                            className={`text-3xl font-bold mt-2 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            {value}
                        </p>
                        {subtitle && (
                            <p
                                className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"
                                    }`}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg bg-${color}-500/10`}>
                        <Icon className={`w-6 h-6 text-${color}-500`} />
                    </div>
                </div>
            </div>
        </BackgroundGradient>
    );

    return (
        <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center">
                <h2
                    className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                >
                    Analytics Overview
                </h2>
                <div className="flex gap-2">
                    {(["24h", "7d", "30d", "all"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${timeRange === range
                                ? "bg-blue-500 text-white"
                                : isDarkMode
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {range === "24h"
                                ? "24 Hours"
                                : range === "7d"
                                    ? "7 Days"
                                    : range === "30d"
                                        ? "30 Days"
                                        : "All Time"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Eye}
                    title="Total Views"
                    value={(analytics.totalViews || 0).toLocaleString()}
                    subtitle="Page views"
                    color="blue"
                />
                <StatCard
                    icon={Users}
                    title="Unique Visitors"
                    value={(analytics.uniqueVisitors || 0).toLocaleString()}
                    subtitle="Unique users"
                    color="purple"
                />
                <StatCard
                    icon={Clock}
                    title="Avg. Duration"
                    value={`${Math.floor((analytics.avgDuration || 0) / 60)}m ${(analytics.avgDuration || 0) % 60}s`}
                    subtitle="Time on site"
                    color="green"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Engagement"
                    value={`${Math.round(((analytics.avgDuration || 0) / 60) * 10) / 10}x`}
                    subtitle="Interaction rate"
                    color="pink"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <BackgroundGradient className="rounded-[22px] p-1">
                    <div
                        className={`p-6 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="w-6 h-6 text-blue-500" />
                            <h3
                                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Top Countries
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {(analytics.topCountries || []).slice(0, 5).map((country, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span
                                            className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                }`}
                                        >
                                            {country.country || "Unknown"}
                                        </span>
                                        <span
                                            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                }`}
                                        >
                                            {country.count} views
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${analytics.topCountries && analytics.topCountries[0] ? (country.count / analytics.topCountries[0].count) * 100 : 0}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </BackgroundGradient>

                {/* Device Breakdown */}
                <BackgroundGradient className="rounded-[22px] p-1">
                    <div
                        className={`p-6 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <MousePointer className="w-6 h-6 text-purple-500" />
                            <h3
                                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Device Types
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {(analytics.deviceBreakdown || []).map((device, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span
                                            className={`font-medium capitalize ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                }`}
                                        >
                                            {device.device}
                                        </span>
                                        <span
                                            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                }`}
                                        >
                                            {device.count} visits
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${analytics.deviceBreakdown && analytics.deviceBreakdown[0] ? (device.count / analytics.deviceBreakdown[0].count) * 100 : 0}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </BackgroundGradient>
            </div>

            {/* Top Pages */}
            <BackgroundGradient className="rounded-[22px] p-1">
                <div
                    className={`p-6 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                        }`}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="w-6 h-6 text-green-500" />
                        <h3
                            className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            Most Visited Pages
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    className={`border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"
                                        }`}
                                >
                                    <th
                                        className={`text-left py-3 px-4 font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                            }`}
                                    >
                                        Page
                                    </th>
                                    <th
                                        className={`text-right py-3 px-4 font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                            }`}
                                    >
                                        Views
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(analytics.topPages || []).map((page, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"
                                            }`}
                                    >
                                        <td
                                            className={`py-3 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                }`}
                                        >
                                            {page.page}
                                        </td>
                                        <td
                                            className={`py-3 px-4 text-right font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                                                }`}
                                        >
                                            {page.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </BackgroundGradient>
        </div>
    );
}
