import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  const updatePosition = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Only update if scroll position actually changed significantly
    if (Math.abs(currentScrollY - lastScrollY.current) < 1) return;

    lastScrollY.current = currentScrollY;

    // Use functional update to prevent unnecessary re-renders
    setScrollPosition((prev) => {
      const diff = Math.abs(prev - currentScrollY);
      return diff > 0.5 ? currentScrollY : prev;
    });
  }, []);

  const requestTick = useCallback(() => {
    // Cancel previous animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Set initial position
    const initialScrollY = window.scrollY;
    setScrollPosition(initialScrollY);
    lastScrollY.current = initialScrollY;

    // Add scroll listener
    window.addEventListener("scroll", requestTick, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestTick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [requestTick]);

  return scrollPosition;
};
