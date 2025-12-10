"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import useStore from "@/store/store";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
    showInfo?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    showInfo = true,
}) => {
    const { isDarkMode } = useStore();

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {showInfo && (
                <div
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                >
                    Showing {startItem} to {endItem} of {totalItems} results
                </div>
            )}

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1
                            ? isDarkMode
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isDarkMode
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === "..." ? (
                                <span
                                    className={`px-3 py-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                                        }`}
                                >
                                    <MoreHorizontal size={16} />
                                </span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : isDarkMode
                                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                            ? isDarkMode
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : isDarkMode
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;