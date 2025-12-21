"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileText, Trash2, Download, Eye, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import useStore from "@/store/store";
import { toast } from "react-toastify";

interface CVDocument {
    id: string;
    filename: string;
    original_filename: string;
    file_url: string;
    file_size: number;
    mime_type: string;
    is_active: boolean;
    uploaded_at: string;
    updated_at: string;
}

const CVManager: React.FC = () => {
    const { isDarkMode } = useStore();
    const [cvDocuments, setCvDocuments] = useState<CVDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchCVDocuments();
    }, []);

    const fetchCVDocuments = async () => {
        try {
            const { getSupabase } = await import("@/lib/supabase");
            const {
                data: { session },
            } = await getSupabase().auth.getSession();

            const headers: HeadersInit = {};
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const response = await fetch("/api/cv", { headers });
            if (response.ok) {
                const data = await response.json();
                setCvDocuments(data);
            } else {
                console.error("Failed to fetch CV documents");
            }
        } catch (error) {
            console.error("Error fetching CV documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file only");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const { getSupabase } = await import("@/lib/supabase");
            const {
                data: { session },
            } = await getSupabase().auth.getSession();

            const headers: HeadersInit = {};
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/cv/upload", {
                method: "POST",
                headers,
                body: formData,
            });

            if (response.ok) {
                const newCV = await response.json();
                setCvDocuments((prev) => [newCV, ...prev]);
                toast.success("CV uploaded successfully!");

                // Reset file input
                event.target.value = "";
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to upload CV");
            }
        } catch (error) {
            console.error("Error uploading CV:", error);
            toast.error("Failed to upload CV");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            const { getSupabase } = await import("@/lib/supabase");
            const {
                data: { session },
            } = await getSupabase().auth.getSession();

            const headers: HeadersInit = {};
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const response = await fetch(`/api/cv/${id}/activate`, {
                method: "PATCH",
                headers,
            });

            if (response.ok) {
                const updatedCV = await response.json();
                setCvDocuments((prev) =>
                    prev.map((cv) => ({
                        ...cv,
                        is_active: cv.id === id,
                    }))
                );
                toast.success("CV set as active successfully!");
            } else {
                toast.error("Failed to set CV as active");
            }
        } catch (error) {
            console.error("Error setting CV as active:", error);
            toast.error("Failed to set CV as active");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this CV?")) return;

        try {
            const { getSupabase } = await import("@/lib/supabase");
            const {
                data: { session },
            } = await getSupabase().auth.getSession();

            const headers: HeadersInit = {};
            if (session?.access_token) {
                headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const response = await fetch(`/api/cv/${id}`, {
                method: "DELETE",
                headers,
            });

            if (response.ok) {
                setCvDocuments((prev) => prev.filter((cv) => cv.id !== id));
                toast.success("CV deleted successfully!");
            } else {
                toast.error("Failed to delete CV");
            }
        } catch (error) {
            console.error("Error deleting CV:", error);
            toast.error("Failed to delete CV");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading CV documents...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg`}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    CV Management
                </h2>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="cv-upload"
                    />
                    <label
                        htmlFor="cv-upload"
                        className={`cursor-pointer flex flex-col items-center gap-4 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {uploading ? (
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        ) : (
                            <Upload className="w-12 h-12 text-gray-400" />
                        )}
                        <div>
                            <p className="text-lg font-medium">
                                {uploading ? "Uploading..." : "Upload your CV"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                PDF files only, max 10MB
                            </p>
                        </div>
                    </label>

                    {uploading && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CV Documents List */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg`}>
                <h3 className="text-xl font-semibold mb-4">Uploaded CVs</h3>

                {cvDocuments.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            No CV documents uploaded yet. Upload your first CV above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cvDocuments.map((cv) => (
                            <div
                                key={cv.id}
                                className={`border rounded-lg p-4 ${cv.is_active
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-gray-200 dark:border-gray-700"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-red-500" />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{cv.original_filename}</h4>
                                                {cv.is_active && (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatFileSize(cv.file_size)} • Uploaded {formatDate(cv.uploaded_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={cv.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                            title="Preview CV"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </a>

                                        <a
                                            href={cv.file_url}
                                            download={cv.original_filename}
                                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                                            title="Download CV"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>

                                        {!cv.is_active && (
                                            <button
                                                onClick={() => handleSetActive(cv.id)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                            >
                                                Set Active
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(cv.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                            title="Delete CV"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className={`${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"} rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                            CV Management Tips:
                        </p>
                        <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• Only one CV can be active at a time</li>
                            <li>• The active CV will be displayed on your website</li>
                            <li>• PDF files only, maximum size 10MB</li>
                            <li>• You can preview, download, or delete any uploaded CV</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVManager;