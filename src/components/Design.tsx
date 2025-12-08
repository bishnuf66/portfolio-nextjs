"use client";

import { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { loadSlim } from "tsparticles-slim";
import useStore from "@/store/store";

const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });

interface DesignProps {
  id?: string;
}

const Design = ({ id = "tsparticles-default" }: DesignProps) => {
  const { isDarkMode } = useStore();
  const particleColor = isDarkMode ? "#ffffff" : "#6366f1";
  const linksColor = isDarkMode ? "#ffffff" : "#8b5cf6";

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // Removed console.log to prevent unnecessary re-renders
  }, []);

  const particlesOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: false },
          onHover: { enable: true, mode: "grab" },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
            },
          },
        },
      },
      particles: {
        color: { value: particleColor },
        links: {
          color: linksColor,
          distance: 150,
          enable: true,
          opacity: isDarkMode ? 0.2 : 0.3,
          width: 1,
        },
        collisions: { enable: false },
        move: {
          enable: true,
          outModes: { default: "out" as const },
          speed: 1,
          straight: false,
        },
        number: {
          density: { enable: true, area: 1500 },
          value: 80,
        },
        opacity: {
          value: isDarkMode ? 0.3 : 0.5,
        },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2 } },
      },
      detectRetina: true,
    }),
    [particleColor, linksColor, isDarkMode]
  );

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
