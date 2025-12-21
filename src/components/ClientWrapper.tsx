"use client";

import { ReactNode } from "react";
import useStore from "@/store/store";

interface ClientWrapperProps {
    children: (isDarkMode: boolean) => ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
    const { isDarkMode } = useStore();
    return <>{children(isDarkMode)}</>;
}