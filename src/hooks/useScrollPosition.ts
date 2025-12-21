import { useEffect, useState } from "react";

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let ticking = false;

    const updatePosition = () => {
      setScrollPosition(window.scrollY);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    // Set initial position
    setScrollPosition(window.scrollY);

    // Add scroll listener
    window.addEventListener("scroll", requestTick, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestTick);
    };
  }, []); // Empty dependency array is correct here

  return scrollPosition;
};
