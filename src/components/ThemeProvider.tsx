"use client";
import { useEffect } from "react";
import useStore from "@/store/store";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <>{children}</>;
};

export default ThemeProvider;
