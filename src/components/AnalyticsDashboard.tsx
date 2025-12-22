"use client";

import React, { useEffect, useState, useMemo } from "react";
import useStore from "@/store/store";
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { Select } from "@/components/ui/Select";
import { getInputClasses } from "@/utils/colorUtils";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topCountries: { country: string; count: number }[];
  topPages: { page: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  avgDuration: number;
  recentVisitors: { [key: string]: unknown }[];
  projectViews: { project_id: string; count: number }[];
}

interface PaginatedResponse {
  items: Array<{
    country?: string;
    page?: string;
    device?: string;
    count: number;
  }>;
  total: number;
  page: number;
  totalPages: number;
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    avgDuration: number;
  };
}

interface FilterState {
  searchTerm: string;
  selectedCountries: string[];
  selectedDevices: string[];
  minViews: number;
  maxViews: number;
  customDateRange: {
    start: string;
    end: string;
  };
}

type SortField = "country" | "count" | "page" | "device";
type SortDirection = "asc" | "desc";

export default function AnalyticsDashboard() {
  const { isDarkMode } = useStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
    "7d"
  );
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse>({
    items: [],
    total: 0,
    page: 1,
    totalPages: 0,
    summary: { totalViews: 0, uniqueVisitors: 0, avgDuration: 0 },
  });

  // New state for enhanced filtering and sorting
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCountries: [],
    selectedDevices: [],
    minViews: 0,
    maxViews: 0,
    customDateRange: {
      start: "",
      end: "",
    },
  });

  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "count",
    direction: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<
    "countries" | "pages" | "devices"
  >("countries");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [maxViewsInitialized, setMaxViewsInitialized] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, filters, sortConfig, activeView, currentPage]);

  // Reset pagination when filters/view/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig, activeView]);

  // Filtered and sorted data (kept for backward compatibility with summary stats)
  const filteredData = useMemo(() => {
    if (!analytics) return { countries: [], pages: [], devices: [] };

    const filterBySearch = (
      items: { [key: string]: any }[],
      searchFields: string[]
    ) => {
      if (!filters.searchTerm) return items;
      return items.filter((item) =>
        searchFields.some((field) =>
          item[field]?.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    };

    const filterByViews = (items: { [key: string]: any }[]) => {
      if (filters.minViews === 0 && filters.maxViews === 0) return items;
      return items.filter((item) => {
        const count = item.count;
        const minCheck = filters.minViews === 0 || count >= filters.minViews;
        const maxCheck = filters.maxViews === 0 || count <= filters.maxViews;
        return minCheck && maxCheck;
      });
    };

    const sortData = (items: { [key: string]: any }[], field: string) => {
      return [...items].sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortConfig.direction === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    };

    // Ensure arrays exist with fallbacks
    const topCountries = analytics.topCountries || [];
    const topPages = analytics.topPages || [];
    const deviceBreakdown = analytics.deviceBreakdown || [];

    // Filter countries
    let countries = filterBySearch(topCountries, ["country"]);
    if (filters.selectedCountries.length > 0) {
      countries = countries.filter((c) =>
        filters.selectedCountries.includes(c.country)
      );
    }
    countries = filterByViews(countries);
    countries = sortData(
      countries,
      sortConfig.field === "country" ? "country" : "count"
    );

    // Filter pages
    let pages = filterBySearch(topPages, ["page"]);
    pages = filterByViews(pages);
    pages = sortData(pages, sortConfig.field === "page" ? "page" : "count");

    // Filter devices
    let devices = filterBySearch(deviceBreakdown, ["device"]);
    if (filters.selectedDevices.length > 0) {
      devices = devices.filter((d) =>
        filters.selectedDevices.includes(d.device)
      );
    }
    devices = filterByViews(devices);
    devices = sortData(
      devices,
      sortConfig.field === "device" ? "device" : "count"
    );

    return { countries, pages, devices };
  }, [analytics, filters, sortConfig]);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    if (!analytics) return { countries: [], devices: [] };

    return {
      countries: [
        ...new Set(
          paginatedData.items.map((c) => c.country).filter(Boolean) as string[]
        ),
      ],
      devices: [
        ...new Set(
          paginatedData.items.map((d) => d.device).filter(Boolean) as string[]
        ),
      ],
    };
  }, [paginatedData.items]);

  const fetchAnalytics = async () => {
    try {
      // Get the auth token from Supabase
      const { getSupabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      // Build query params
      const params = new URLSearchParams();
      params.append("range", timeRange);
      params.append("view", activeView);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      params.append("sortField", sortConfig.field);
      params.append("sortDirection", sortConfig.direction);

      if (filters.searchTerm) {
        params.append("searchTerm", filters.searchTerm);
      }
      filters.selectedCountries.forEach((c) => {
        params.append("selectedCountries", c);
      });
      filters.selectedDevices.forEach((d) => {
        params.append("selectedDevices", d);
      });
      if (filters.minViews > 0) {
        params.append("minViews", filters.minViews.toString());
      }
      if (filters.maxViews > 0) {
        params.append("maxViews", filters.maxViews.toString());
      }

      const response = await fetch(`/api/analytics?${params.toString()}`, {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        console.error(
          "Analytics fetch failed:",
          response.status,
          response.statusText
        );
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data: PaginatedResponse = await response.json();
      setPaginatedData(data);

      // Set analytics from summary
      setAnalytics({
        totalViews: data.summary.totalViews,
        uniqueVisitors: data.summary.uniqueVisitors,
        topCountries: [],
        topPages: [],
        deviceBreakdown: [],
        avgDuration: data.summary.avgDuration,
        recentVisitors: [],
        projectViews: [],
      });

      // Set max views for filter only on first load
      if (!maxViewsInitialized && data.items.length > 0) {
        const maxViews = Math.max(...data.items.map((p) => p.count));
        setFilters((prev) => ({ ...prev, maxViews: maxViews }));
        setMaxViewsInitialized(true);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
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
      setPaginatedData({
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
        summary: { totalViews: 0, uniqueVisitors: 0, avgDuration: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCountries: [],
      selectedDevices: [],
      minViews: 0,
      maxViews: filters.maxViews, // Keep the current maxViews to avoid infinite loops
      customDateRange: { start: "", end: "" },
    });
  };

  const exportData = () => {
    if (!analytics) return;

    const data = {
      summary: {
        totalViews: analytics.totalViews,
        uniqueVisitors: analytics.uniqueVisitors,
        avgDuration: analytics.avgDuration,
        timeRange,
        exportDate: new Date().toISOString(),
      },
      countries: filteredData.countries,
      pages: filteredData.pages,
      devices: filteredData.devices,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (
    !analytics ||
    (analytics.totalViews === 0 && analytics.topCountries.length === 0)
  ) {
    return (
      <div className="text-center py-12">
        <div
          className={`max-w-md mx-auto p-8 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-lg mb-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No analytics data yet
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Analytics will appear here once you:
          </p>
          <ol
            className={`text-sm mt-4 space-y-2 text-left ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
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
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtitle?: string;
    color: "blue" | "purple" | "green" | "pink";
  }) => {
    const colorBgMap = {
      blue: "bg-blue-500/10",
      purple: "bg-purple-500/10",
      green: "bg-green-500/10",
      pink: "bg-pink-500/10",
    };
    const colorTextMap = {
      blue: "text-blue-500",
      purple: "text-purple-500",
      green: "text-green-500",
      pink: "text-pink-500",
    };

    return (
      <BackgroundGradient className="rounded-[22px] p-1">
        <div
          className={`p-6 rounded-[20px] ${
            isDarkMode ? "bg-black" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {title}
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {value}
              </p>
              {subtitle && (
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${colorBgMap[color]}`}>
              <Icon className={`w-6 h-6 ${colorTextMap[color]}`} />
            </div>
          </div>
        </div>
      </BackgroundGradient>
    );
  };
  return (
    <div className="space-y-8">
      {/* Enhanced Header with Search and Filters */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Analytics Overview
          </h2>
          <div className="flex gap-2">
            {(["24h", "7d", "30d", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
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

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries, pages, or devices..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showFilters
                ? "bg-blue-500 text-white border-blue-500"
                : isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Export Button */}
          <button
            onClick={exportData}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Clear Filters */}
          {(filters.searchTerm ||
            filters.selectedCountries.length > 0 ||
            filters.selectedDevices.length > 0 ||
            filters.minViews > 0) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <BackgroundGradient className="rounded-[22px] p-1">
            <div
              className={`p-6 rounded-[20px] ${
                isDarkMode ? "bg-black" : "bg-white"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Country Filter */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Countries
                  </label>
                  <select
                    multiple
                    value={filters.selectedCountries}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setFilters((prev) => ({
                        ...prev,
                        selectedCountries: values,
                      }));
                    }}
                    className={`${getInputClasses(
                      "w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    )}`}
                    size={3}
                  >
                    {filterOptions.countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Device Filter */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Devices
                  </label>
                  <select
                    multiple
                    value={filters.selectedDevices}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setFilters((prev) => ({
                        ...prev,
                        selectedDevices: values,
                      }));
                    }}
                    className={`${getInputClasses(
                      "w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    )}`}
                    size={3}
                  >
                    {filterOptions.devices.map((device) => (
                      <option
                        key={device}
                        value={device}
                        className="capitalize"
                      >
                        {device}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Views Filter */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Min Views
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minViews}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minViews: parseInt(e.target.value) || 0,
                      }))
                    }
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Max Views Filter */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Max Views
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={filters.maxViews}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxViews: parseInt(e.target.value) || 0,
                      }))
                    }
                    className={`w-full p-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
            </div>
          </BackgroundGradient>
        )}
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
          value={`${Math.floor((analytics.avgDuration || 0) / 60)}m ${
            (analytics.avgDuration || 0) % 60
          }s`}
          subtitle="Time on site"
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          title="Engagement"
          value={`${
            Math.round(((analytics.avgDuration || 0) / 60) * 10) / 10
          }x`}
          subtitle="Interaction rate"
          color="pink"
        />
      </div>

      {/* Data View Tabs */}
      <div
        className="flex gap-4 border-b"
        style={{ borderColor: isDarkMode ? "#374151" : "#e5e7eb" }}
      >
        {(["countries", "pages", "devices"] as const).map((view) => (
          <button
            key={view}
            onClick={() => {
              setActiveView(view);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 font-medium text-sm transition-colors capitalize ${
              activeView === view
                ? "text-blue-500 border-b-2 border-blue-500"
                : isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {view === "countries"
              ? "Top Countries"
              : view === "pages"
              ? "Top Pages"
              : "Devices"}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <BackgroundGradient className="rounded-[22px] p-1">
        <div
          className={`rounded-[20px] overflow-hidden ${
            isDarkMode ? "bg-black" : "bg-white"
          }`}
        >
          {paginatedData.total === 0 ? (
            <div className="p-8 text-center">
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                No data available for the current filters
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDarkMode
                          ? "border-gray-800 bg-gray-900"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <th className="px-6 py-3 text-left">
                        <button
                          onClick={() =>
                            handleSort(
                              activeView === "countries"
                                ? "country"
                                : activeView === "pages"
                                ? "page"
                                : "device"
                            )
                          }
                          className="flex items-center gap-1 font-semibold text-sm hover:text-blue-500 transition-colors"
                        >
                          {activeView === "countries"
                            ? "Country"
                            : activeView === "pages"
                            ? "Page"
                            : "Device"}
                          {sortConfig.field ===
                            (activeView === "countries"
                              ? "country"
                              : activeView === "pages"
                              ? "page"
                              : "device") &&
                            (sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleSort("count")}
                          className="flex items-center justify-end gap-1 font-semibold text-sm hover:text-blue-500 transition-colors w-full"
                        >
                          Views
                          {sortConfig.field === "count" &&
                            (sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-sm">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.items.map(
                      (
                        item: {
                          country?: string;
                          page?: string;
                          device?: string;
                          count: number;
                        },
                        index: number
                      ) => {
                        const totalCount = paginatedData.items.reduce(
                          (sum, i) => sum + i.count,
                          0
                        );
                        const percentage = (
                          (item.count / totalCount) *
                          100
                        ).toFixed(1);
                        return (
                          <tr
                            key={index}
                            className={`border-b ${
                              isDarkMode
                                ? "border-gray-800 hover:bg-gray-900"
                                : "border-gray-200 hover:bg-gray-50"
                            } transition-colors`}
                          >
                            <td
                              className={`px-6 py-4 font-medium ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.country || item.page || item.device}
                            </td>
                            <td
                              className={`px-6 py-4 text-right font-semibold ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                              }`}
                            >
                              {item.count.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 bg-gray-300 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-blue-500 h-full rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-sm font-medium w-12 text-right ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {paginatedData.totalPages > 1 && (
                <div
                  className={`flex items-center justify-between px-6 py-4 border-t ${
                    isDarkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Showing {(paginatedData.page - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      paginatedData.page * itemsPerPage,
                      paginatedData.total
                    )}{" "}
                    of {paginatedData.total} items
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={paginatedData.page === 1}
                      className={`p-2 rounded-lg transition-all ${
                        paginatedData.page === 1
                          ? isDarkMode
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: paginatedData.totalPages },
                        (_, i) => i + 1
                      )
                        .slice(
                          Math.max(0, paginatedData.page - 2),
                          Math.min(
                            paginatedData.totalPages,
                            paginatedData.page + 1
                          )
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              paginatedData.page === page
                                ? "bg-blue-500 text-white"
                                : isDarkMode
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, paginatedData.totalPages)
                        )
                      }
                      disabled={paginatedData.page === paginatedData.totalPages}
                      className={`p-2 rounded-lg transition-all ${
                        paginatedData.page === paginatedData.totalPages
                          ? isDarkMode
                            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isDarkMode
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </BackgroundGradient>
    </div>
  );
}
