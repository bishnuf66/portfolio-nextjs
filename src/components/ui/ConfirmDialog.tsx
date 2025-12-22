"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";
import useStore from "@/store/store";

export type ConfirmDialogOptions = {
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary" | "default";
  // Optional: extra content under message (e.g., details)
  description?: string;
};

type ConfirmDialogContextType = {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(null);

export const useConfirm = (): ConfirmDialogContextType["confirm"] => {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider");
  }
  return ctx.confirm;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useStore();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);
  const [resolver, setResolver] = useState<((result: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions({
        title: "Confirm Action",
        confirmText: "Confirm",
        cancelText: "Cancel",
        confirmVariant: "danger",
        ...opts,
      });
      setResolver(() => resolve);
      setOpen(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setOptions(null);
    setResolver(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolver?.(false);
    handleClose();
  }, [resolver, handleClose]);

  const handleConfirm = useCallback(() => {
    resolver?.(true);
    handleClose();
  }, [resolver, handleClose]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}

      {/* Modal */}
      {open && options && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              } w-full max-w-md rounded-lg shadow-xl border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">{options.title || "Confirm Action"}</h3>
                <button
                  onClick={handleCancel}
                  className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-4 py-4 space-y-2">
                {typeof options.message === "string" ? (
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{options.message}</p>
                ) : (
                  options.message
                )}
                {options.description && (
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{options.description}</p>
                )}
              </div>

              <div className={`px-4 py-3 border-t flex justify-end gap-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 rounded ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {options.cancelText || "Cancel"}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 rounded text-white ${
                    options.confirmVariant === "danger"
                      ? "bg-red-600 hover:bg-red-700"
                      : options.confirmVariant === "primary"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-800 hover:bg-gray-900"
                  }`}
                >
                  {options.confirmText || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};
