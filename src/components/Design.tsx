"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { loadSlim } from "tsparticles-slim";
import useStore from "@/store/store";

const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });

interface DesignProps {
  id?: string;
}

const Design = ({ id = "tsparticles-default" }: DesignProps) => {
  const { isDarkMode } = useStore();
  // Compute mobile state once on mount using lazy init
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const isMobileViewport = window.innerWidth < 768;
    const isCoarsePointer =
      window.matchMedia?.("(pointer: coarse)").matches ?? false;
    return isMobileViewport || isCoarsePointer;
  });

  const particleColor = isDarkMode ? "#ffffff" : "#6366f1";
  const linksColor = isDarkMode ? "#ffffff" : "#8b5cf6";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // Removed console.log to prevent unnecessary re-renders
  }, []);

  const particlesOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 30,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: true, mode: "grab" },
          resize: true,
        },
        modes: {
          grab: {
            distance: 100,
            links: {
              opacity: 0.3,
            },
          },
        },
      },
      particles: {
        color: { value: particleColor },
        links: {
          color: linksColor,
          distance: 120,
          enable: true,
          opacity: isDarkMode ? 0.15 : 0.25,
          width: 1,
        },
        collisions: { enable: false },
        move: {
          enable: true,
          outModes: { default: "out" as const },
          speed: 0.8,
          straight: false,
        },
        number: {
          density: { enable: true, area: 2000 },
          value: 40,
        },
        opacity: {
          value: isDarkMode ? 0.25 : 0.4,
        },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2 } },
      },
      detectRetina: false,
    }),
    [particleColor, linksColor, isDarkMode],
  );

  // Disable particles entirely on mobile for performance
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Particles
        id={id}
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default Design;
