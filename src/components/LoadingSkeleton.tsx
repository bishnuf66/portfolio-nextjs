import React from "react";
import useStore from "@/store/store";

export const ProjectCardSkeleton = () => {
    const { isDarkMode } = useStore();
    return (
        <div
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl overflow-hidden shadow-lg animate-pulse`}
        >
            <div className={`h-48 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            <div className="p-6 space-y-3">
                <div
                    className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-3/4`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-5/6`}
                />
                <div className="flex gap-2 pt-2">
                    <div
                        className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-16`}
                    />
                    <div
                        className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-16`}
                    />
                    <div
                        className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-16`}
                    />
                </div>
            </div>
        </div>
    );
};

export const BlogCardSkeleton = () => {
    const { isDarkMode } = useStore();
    return (
        <div
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl overflow-hidden shadow-lg animate-pulse`}
        >
            <div className={`h-56 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            <div className="p-6 space-y-3">
                <div
                    className={`h-7 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-4/5`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-3/4`}
                />
                <div className="flex gap-2 pt-2">
                    <div
                        className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-20`}
                    />
                    <div
                        className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-20`}
                    />
                </div>
            </div>
        </div>
    );
};

export const TestimonialCardSkeleton = () => {
    const { isDarkMode } = useStore();
    return (
        <div
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl p-6 shadow-lg animate-pulse`}
        >
            <div className="flex items-center gap-4 mb-4">
                <div
                    className={`w-16 h-16 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                />
                <div className="flex-1 space-y-2">
                    <div
                        className={`h-5 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-32`}
                    />
                    <div
                        className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                            } rounded w-48`}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-3/4`}
                />
            </div>
        </div>
    );
};

export const BlogDetailSkeleton = () => {
    const { isDarkMode } = useStore();
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
            <div
                className={`h-10 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded w-3/4 mb-6`}
            />
            <div className="flex gap-4 mb-8">
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-32`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-24`}
                />
            </div>
            <div
                className={`h-96 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } rounded-xl mb-8`}
            />
            <div className="space-y-4">
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-5/6`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                />
                <div
                    className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-4/5`}
                />
            </div>
        </div>
    );
};

export const DashboardSkeleton = () => {
    const { isDarkMode } = useStore();
    return (
        <div className="space-y-6">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                        } rounded-lg p-6 shadow-lg animate-pulse`}
                >
                    <div className="flex gap-6">
                        <div
                            className={`w-24 h-24 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                }`}
                        />
                        <div className="flex-1 space-y-3">
                            <div
                                className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    } rounded w-1/3`}
                            />
                            <div
                                className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    } rounded w-full`}
                            />
                            <div
                                className={`h-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                    } rounded w-2/3`}
                            />
                            <div className="flex gap-2">
                                <div
                                    className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                        } rounded w-16`}
                                />
                                <div
                                    className={`h-6 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                        } rounded w-16`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
