import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Set initial position
    const initialScrollY = window.scrollY;
    setScrollPosition(initialScrollY);
    lastScrollY.current = initialScrollY;

    // Create stable scroll handler
    const handleScroll = () => {
      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only update if scroll position actually changed significantly
        if (Math.abs(currentScrollY - lastScrollY.current) < 1) return;

        lastScrollY.current = currentScrollY;
        setScrollPosition(currentScrollY);
      });
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return scrollPosition;
};
