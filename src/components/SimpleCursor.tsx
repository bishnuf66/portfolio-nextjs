"use client";

import { useEffect, useState, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const SimpleCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState("default");
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [mounted, setMounted] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);

  const animationRef = useRef<number | undefined>(undefined);
  const trailIdRef = useRef(0);
  const rippleIdRef = useRef(0);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);

    // Check device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setSupportsHover(!isMobile && hasHover);

    // Check initial cursor state from localStorage
    const stored = localStorage.getItem("customCursorEnabled");
    const initialEnabled = stored !== null ? JSON.parse(stored) : true;
    setCursorEnabled(initialEnabled);
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!mounted) return;

    // Listen for cursor toggle events
    const handleCursorToggle = (e: CustomEvent) => {
      setCursorEnabled(e.detail.enabled);
      if (!e.detail.enabled) {
        setIsVisible(false);
      }
    };

    // Listen for media query changes
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const handleChange = (e: MediaQueryListEvent) => {
      setSupportsHover(!isMobile && e.matches);
      if (!e.matches) {
        setIsVisible(false);
      }
    };

    window.addEventListener('cursorToggle', handleCursorToggle as EventListener);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      window.removeEventListener('cursorToggle', handleCursorToggle as EventListener);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mounted]);

  // Smooth cursor following animation
  useEffect(() => {
    if (!mounted || !supportsHover || !cursorEnabled) return;

    const animate = () => {
      setPosition((prev) => {
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;

        // Only animate if there's a meaningful difference
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return prev;
        }

        // Smooth interpolation with easing
        const newX = prev.x + dx * 0.15;
        const newY = prev.y + dy * 0.15;

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPosition, mounted, supportsHover, cursorEnabled]);

  // Trail effect
  useEffect(() => {
    if (!mounted || !supportsHover || !cursorEnabled) return;

    const intervalId = setInterval(() => {
      setTrail((prev) => {
        const newTrail = {
          x: position.x,
          y: position.y,
          id: trailIdRef.current++,
        };
        return [...prev.slice(-12), newTrail];
      });
    }, 16); // 60fps

    return () => clearInterval(intervalId);
  }, [position, mounted, supportsHover, cursorEnabled]);

  // Mouse event handlers
  useEffect(() => {
    if (!mounted || !supportsHover || !cursorEnabled) return;

    let isActive = true;

    const updatePosition = (e: MouseEvent) => {
      if (!isActive) return;

      setTargetPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        getComputedStyle(target).cursor === "pointer"
      ) {
        setCursorType("pointer");
        setIsHovering(true);
      } else if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        setCursorType("text");
        setIsHovering(false);
      } else {
        setCursorType("default");
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isActive) return;
      setIsClicking(true);

      // Create click ripple
      const rippleId = rippleIdRef.current++;
      const newRipple = { id: rippleId, x: e.clientX, y: e.clientY };
      setClickRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setClickRipples((prev) => prev.filter((ripple) => ripple.id !== rippleId));
      }, 800);
    };

    const handleMouseUp = () => {
      if (!isActive) return;
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Apply custom cursor styles
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = `
      * { 
        cursor: none !important; 
      }
      @media (hover: none) and (pointer: coarse) {
        * { 
          cursor: auto !important; 
        }
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    document.addEventListener("mousemove", updatePosition, { passive: true });
    document.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    return () => {
      isActive = false;

      // Clean up styles
      const existingStyle = document.getElementById("custom-cursor-style");
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }

      // Remove event listeners
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mounted, supportsHover, cursorEnabled]);

  if (!mounted || !supportsHover || !isVisible || !cursorEnabled) return null;

  const getCursorSize = () => {
    switch (cursorType) {
      case "pointer":
        return isClicking ? 45 : 38;
      case "text":
        return 24;
      default:
        return isClicking ? 32 : 28;
    }
  };

  const getCursorColor = () => {
    switch (cursorType) {
      case "pointer":
        return "#60a5fa"; // Blue
      case "text":
        return "#34d399"; // Green
      default:
        return "#8b5cf6"; // Purple
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 overflow-hidden">
      {/* Animated Trail */}
      {trail.map((point, index) => {
        const opacity = (index / trail.length) * 0.8;
        const scale = (index / trail.length) * 0.9;
        return (
          <div
            key={point.id}
            className="absolute rounded-full transition-opacity duration-200"
            style={{
              left: point.x - 3,
              top: point.y - 3,
              width: 6,
              height: 6,
              background: `radial-gradient(circle, ${getCursorColor()}${Math.floor(opacity * 100).toString().padStart(2, '0')} 0%, transparent 70%)`,
              transform: `scale(${scale})`,
              opacity: opacity,
            }}
          />
        );
      })}

      {/* Click Ripples */}
      {clickRipples.map((ripple) => (
        <div key={ripple.id} className="absolute">
          {/* Outer ripple */}
          <div
            className="absolute rounded-full animate-ping"
            style={{
              left: ripple.x - 35,
              top: ripple.y - 35,
              width: 70,
              height: 70,
              border: "2px solid",
              borderColor: getCursorColor(),
              animationDuration: "0.8s",
            }}
          />
          {/* Inner ripple */}
          <div
            className="absolute rounded-full animate-ping"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              border: "2px solid",
              borderColor: getCursorColor(),
              animationDuration: "0.6s",
              animationDelay: "0.1s",
            }}
          />
        </div>
      ))}

      {/* Main Cursor with glassmorphism effect */}
      <div
        className="absolute transition-all duration-200 ease-out"
        style={{
          left: position.x - getCursorSize() / 2,
          top: position.y - getCursorSize() / 2,
          transform: `scale(${isClicking ? 0.85 : 1}) rotate(${isHovering ? 45 : 0}deg)`,
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            width: getCursorSize(),
            height: getCursorSize(),
            background: `radial-gradient(circle, ${getCursorColor()}30 0%, transparent 70%)`,
            filter: "blur(8px)",
            animationDuration: "2s",
          }}
        />

        {/* Main cursor body */}
        <div
          className="rounded-full backdrop-blur-md border-2 flex items-center justify-center relative overflow-hidden"
          style={{
            width: getCursorSize(),
            height: getCursorSize(),
            borderColor: getCursorColor(),
            background: `linear-gradient(135deg, ${getCursorColor()}20 0%, ${getCursorColor()}10 100%)`,
            boxShadow: isHovering
              ? `0 0 30px ${getCursorColor()}60, inset 0 0 20px ${getCursorColor()}20`
              : `0 0 20px ${getCursorColor()}40, inset 0 0 15px ${getCursorColor()}15`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: `linear-gradient(45deg, transparent 30%, ${getCursorColor()}40 50%, transparent 70%)`,
              animation: "shimmer 2s infinite linear",
            }}
          />

          {/* Inner core */}
          <div
            className="rounded-full relative z-10"
            style={{
              width: cursorType === "text" ? 3 : 8,
              height: cursorType === "text" ? 20 : 8,
              background: `linear-gradient(180deg, ${getCursorColor()} 0%, ${getCursorColor()}cc 100%)`,
              boxShadow: `0 0 10px ${getCursorColor()}80`,
            }}
          />
        </div>
      </div>

      {/* Enhanced hover ring */}
      {isHovering && (
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            left: position.x - 50,
            top: position.y - 50,
            width: 100,
            height: 100,
            border: `1px solid ${getCursorColor()}40`,
            background: `radial-gradient(circle, ${getCursorColor()}10 0%, transparent 70%)`,
            animationDuration: "1.5s",
          }}
        />
      )}

      {/* Cursor type indicator */}
      {cursorType !== "default" && (
        <div
          className="absolute text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm transition-all duration-300"
          style={{
            left: position.x + 30,
            top: position.y - 15,
            backgroundColor: `${getCursorColor()}20`,
            color: getCursorColor(),
            border: `1px solid ${getCursorColor()}60`,
            transform: `scale(${isClicking ? 0.9 : 1})`,
          }}
        >
          {cursorType.toUpperCase()}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(-45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(-45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleCursor;