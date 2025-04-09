import { useCallback } from "react";
import dynamic from "next/dynamic";
import { loadSlim } from "tsparticles-slim"; // Use loadSlim instead of loadFull

const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });
import useStore from "@/store/store";

const Design = () => {
  const { isDarkMode } = useStore();
  const particleColor = isDarkMode ? "#ffffff" : "#000000";
  const linksColor = isDarkMode ? "#ffffff" : "#000000";

  const particlesInit = useCallback(async (engine: any) => {
    console.log("Particles Engine Loaded:", engine);
    await loadSlim(engine); // Ensure slim is used
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log("Particles Container:", container);
  }, []);

  return (
    <div>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: true },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse", distance: 400 },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 150, duration: 0.4 },
            },
          },
          particles: {
            color: { value: particleColor },
            links: {
              color: linksColor,
              distance: 120,
              enable: true,
              opacity: 0.6,
              width: 1,
            },
            collisions: { enable: true },
            move: {
              enable: true,
              outModes: { default: "bounce" },
              speed: 3,
            },
            number: { density: { enable: true, area: 1200 }, value: 80 },
            opacity: { value: 0.5 },
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
