"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { loadSlim } from "tsparticles-slim";

const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });
import useStore from "@/store/store";

const Design = () => {
  const { isDarkMode } = useStore();
  const particleColor = isDarkMode ? "#ffffff" : "#000000";
  const linksColor = isDarkMode ? "#ffffff" : "#000000";

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    // Particles loaded
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
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
              opacity: 0.2,
              width: 1,
            },
            collisions: { enable: false },
            move: {
              enable: true,
              outModes: { default: "out" },
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 1500 },
              value: 50,
            },
            opacity: {
              value: 0.3,
            },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 2 } },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default Design;
