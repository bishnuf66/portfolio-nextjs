"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import useStore from "@/store/store";
import { useCursorTheme, getCursorVariantStyles } from "@/lib/cursorTheme";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

interface RippleEffect {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

const CustomCursor = () => {
  const { isDarkMode } = useStore();
  const cursorTheme = useCursorTheme(isDarkMode);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("customCursorEnabled");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  // Use refs for position to avoid re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const cursorVariantRef = useRef("default");
  const isClickingRef = useRef(false);

  // Use state for rendering-dependent values
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");

  // Trail and effects
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const rippleEffectsRef = useRef<RippleEffect[]>([]);
  const trailIdRef = useRef(0);
  const rippleIdRef = useRef(0);

  // Listen for cursor toggle events
  useEffect(() => {
    const handleCursorToggle = (e: CustomEvent) => {
      setIsEnabled(e.detail.enabled);
    };

    window.addEventListener(
      "cursorToggle",
      handleCursorToggle as EventListener
    );
    return () => {
      window.removeEventListener(
        "cursorToggle",
        handleCursorToggle as EventListener
      );
    };
  }, []);

  const updateTrail = useCallback(() => {
    const now = Date.now();
    const newTrail: TrailPoint = {
      x: mousePositionRef.current.x,
      y: mousePositionRef.current.y,
      id: trailIdRef.current++,
      timestamp: now,
    };

    trailPointsRef.current.push(newTrail);

    // Remove old trail points (keep last 15 points or points younger than 500ms)
    trailPointsRef.current = trailPointsRef.current.filter(
      (point, index) =>
        index >= trailPointsRef.current.length - 15 &&
        now - point.timestamp < 500
    );

    // Update trail DOM elements
    if (trailContainerRef.current) {
      const container = trailContainerRef.current;

      // Clear existing trail elements
      container.innerHTML = "";

      // Create new trail elements
      trailPointsRef.current.forEach((point) => {
        const trailElement = document.createElement("div");
        const age = now - point.timestamp;
        const opacity = Math.max(0, 1 - age / 500) * cursorTheme.trail.opacity;
        const scale = Math.max(0.2, 1 - age / 500);
        const currentStyles = getCursorVariantStyles(
          cursorVariantRef.current,
          cursorTheme
        );

        trailElement.style.cssText = `
                    position: absolute;
                    left: ${point.x - 3}px;
                    top: ${point.y - 3}px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: ${currentStyles.backgroundColor};
                    opacity: ${opacity};
                    transform: scale(${scale});
                    pointer-events: none;
                    box-shadow: ${cursorTheme.trail.boxShadow};
                    transition: opacity 0.1s ease-out;
                `;

        container.appendChild(trailElement);
      });
    }
  }, [cursorTheme]);

  const createRipple = useCallback(
    (x: number, y: number) => {
      const ripple: RippleEffect = {
        x,
        y,
        id: rippleIdRef.current++,
        timestamp: Date.now(),
      };

      rippleEffectsRef.current.push(ripple);

      if (rippleContainerRef.current) {
        const currentStyles = getCursorVariantStyles(
          cursorVariantRef.current,
          cursorTheme
        );
        const rippleColor = currentStyles.backgroundColor;

        // Create main ripple
        const rippleElement = document.createElement("div");
        rippleElement.style.cssText = `
                position: absolute;
                left: ${x - 30}px;
                top: ${y - 30}px;
                width: 60px;
                height: 60px;
                border: 2px solid ${rippleColor};
                border-radius: 50%;
                pointer-events: none;
                animation: ripple-expand 0.6s ease-out forwards;
                box-shadow: 0 0 10px ${rippleColor}30;
            `;

        rippleContainerRef.current.appendChild(rippleElement);

        // Create a second, larger ripple for more impact
        const rippleElement2 = document.createElement("div");
        rippleElement2.style.cssText = `
                position: absolute;
                left: ${x - 40}px;
                top: ${y - 40}px;
                width: 80px;
                height: 80px;
                border: 1px solid ${rippleColor};
                border-radius: 50%;
                pointer-events: none;
                animation: ripple-expand 0.8s ease-out forwards;
                animation-delay: 0.1s;
                opacity: 0.6;
            `;

        rippleContainerRef.current.appendChild(rippleElement2);

        // Remove ripples after animation
        setTimeout(() => {
          if (rippleElement.parentNode) {
            rippleElement.parentNode.removeChild(rippleElement);
          }
          if (rippleElement2.parentNode) {
            rippleElement2.parentNode.removeChild(rippleElement2);
          }
        }, 800);
      }
    },
    [cursorTheme]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePositionRef.current.x = e.clientX;
    mousePositionRef.current.y = e.clientY;
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      isClickingRef.current = true;
      createRipple(e.clientX, e.clientY);

      if (cursorRef.current) {
        cursorRef.current.style.transform += " scale(0.8)";
      }
    },
    [createRipple]
  );

  const handleMouseUp = useCallback(() => {
    isClickingRef.current = false;
    if (cursorRef.current) {
      cursorRef.current.style.transform =
        cursorRef.current.style.transform.replace(" scale(0.8)", "");
    }
  }, []);

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let newVariant = "default";
      let hovering = false;

      // Enhanced element detection
      if (
        target.closest("button, [role='button']") ||
        target.classList.contains("cursor-pointer")
      ) {
        newVariant = "button";
        hovering = true;
      } else if (
        target.closest(
          "input[type='text'], input[type='email'], input[type='password'], textarea, [contenteditable='true']"
        )
      ) {
        newVariant = "text";
        hovering = true;
      } else if (target.closest("input[type='number'], input[type='range']")) {
        newVariant = "number";
        hovering = true;
      } else if (
        target.closest("select, input[type='checkbox'], input[type='radio']")
      ) {
        newVariant = "select";
        hovering = true;
      } else if (target.closest("a")) {
        newVariant = "button";
        hovering = true;
      }

      if (newVariant !== cursorVariantRef.current || hovering !== isHovering) {
        cursorVariantRef.current = newVariant;
        setCursorVariant(newVariant);
        setIsHovering(hovering);

        if (cursorRef.current) {
          const styles = getCursorVariantStyles(newVariant, cursorTheme);
          const cursor = cursorRef.current;

          Object.assign(cursor.style, {
            width: styles.width,
            height: styles.height,
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow,
          });
        }
      }
    },
    [cursorTheme, isHovering]
  );

  useEffect(() => {
    const isMobileEnv = () => {
      if (typeof window === "undefined") return false;
      const isMobileViewport = window.innerWidth < 768;
      const isCoarsePointer = window.matchMedia
        ? window.matchMedia("(pointer: coarse)").matches
        : false;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      return isMobileViewport || isCoarsePointer || isTouchDevice || isMobileUA;
    };

    // Check if mobile or cursor is disabled
    if (isMobileEnv() || !isEnabled) {
      // Restore default cursor
      document.body.style.cursor = "auto";
      document.documentElement.style.cursor = "auto";
      return;
    }

    // Animation loop function
    const animate = () => {
      if (!cursorRef.current || !cursorDotRef.current) return;

      // Smooth interpolation for main cursor
      targetPositionRef.current.x +=
        (mousePositionRef.current.x - targetPositionRef.current.x) * 0.15;
      targetPositionRef.current.y +=
        (mousePositionRef.current.y - targetPositionRef.current.y) * 0.15;

      // Update main cursor position
      const styles = getCursorVariantStyles(
        cursorVariantRef.current,
        cursorTheme
      );
      const offsetX = parseInt(styles.width) / 2;
      const offsetY = parseInt(styles.height) / 2;

      cursorRef.current.style.transform = `translate3d(${
        targetPositionRef.current.x - offsetX
      }px, ${targetPositionRef.current.y - offsetY}px, 0)`;

      // Update dot position (faster follow)
      cursorDotRef.current.style.transform = `translate3d(${
        mousePositionRef.current.x - 4
      }px, ${mousePositionRef.current.y - 4}px, 0)`;

      // Update glow position if hovering
      if (glowRef.current && isHovering) {
        glowRef.current.style.transform = `translate3d(${
          targetPositionRef.current.x - 50
        }px, ${targetPositionRef.current.y - 50}px, 0)`;
      }

      // Update trail
      updateTrail();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Hide default cursor
    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    // Add event listeners with passive option for better performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Start animation loop
    animate();

    return () => {
      // Cleanup
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Restore default cursor
      document.body.style.cursor = "auto";
      document.documentElement.style.cursor = "auto";
    };
  }, [
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseOver,
    isEnabled,
    cursorTheme,
    updateTrail,
    isHovering,
  ]);

  // Don't render on mobile or when disabled
  const isMobileEnv =
    typeof window !== "undefined" &&
    (window.innerWidth < 768 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0);
  if (isMobileEnv || !isEnabled) return null;

  const currentStyles = getCursorVariantStyles(cursorVariant, cursorTheme);

  return (
    <>
      {/* Trail Container */}
      <div
        ref={trailContainerRef}
        className="fixed top-0 left-0 pointer-events-none z-9997"
        style={{ willChange: "contents" }}
      />

      {/* Ripple Container */}
      <div
        ref={rippleContainerRef}
        className="fixed top-0 left-0 pointer-events-none z-9996"
        style={{ willChange: "contents" }}
      />

      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 border-2"
        style={{
          width: currentStyles.width,
          height: currentStyles.height,
          backgroundColor: currentStyles.backgroundColor,
          borderColor: currentStyles.borderColor,
          borderRadius: currentStyles.borderRadius,
          boxShadow: currentStyles.boxShadow,
          transition:
            "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease, border-color 0.3s ease, transform 0.1s ease, border-radius 0.3s ease, box-shadow 0.3s ease",
          willChange: "transform",
          mixBlendMode: isDarkMode ? "screen" : "multiply",
        }}
      />

      {/* Cursor Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-9998 w-2 h-2 rounded-full"
        style={{
          backgroundColor: cursorTheme.dot.backgroundColor,
          willChange: "transform",
          transition: "opacity 0.2s ease, background-color 0.3s ease",
          opacity: isHovering ? 0.4 : 0.8,
          boxShadow: cursorTheme.dot.boxShadow,
        }}
      />

      {/* Hover Glow Effect */}
      {isHovering && (
        <div
          ref={glowRef}
          className="fixed top-0 left-0 pointer-events-none z-9995 rounded-full animate-pulse"
          style={{
            width: cursorTheme.glow.size,
            height: cursorTheme.glow.size,
            background: cursorTheme.glow.background,
            animationDuration: "2s",
            willChange: "transform",
            filter: cursorTheme.glow.filter,
          }}
        />
      )}

      <style jsx global>{`
        * {
          cursor: none !important;
        }

        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }

        @keyframes ripple-expand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Enhanced theme transitions */
        .custom-cursor-element {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Better visibility in both themes */
        @media (prefers-color-scheme: dark) {
          .custom-cursor-trail {
            filter: brightness(1.2);
          }
        }

        @media (prefers-color-scheme: light) {
          .custom-cursor-trail {
            filter: brightness(0.9);
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
