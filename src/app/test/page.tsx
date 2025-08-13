"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SplineSceneBasic } from "./SplineSceneBasics";

export default function Test() {
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate rotation based on scroll position (max 30 degrees)
  const rotation = Math.min(scrollY * 0.0, 30);

  // Calculate scale to make it look like it's tilting away
  const scale = 1 + scrollY * 0.0005;

  // Calculate translateZ for perspective effect
  const translateZ = -scrollY * 0.1;

  return (
    <div className="min-h-screen overflow-x-hidden bg-black">
      <SplineSceneBasic />

      <div className="relative w-full h-screen overflow-hidden">
        <div
          className="w-full h-full origin-center transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${rotation}deg) scale(${scale}) translateZ(${translateZ}px)`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/mountain.jpg"
              alt="mountain"
              fill
              unoptimized
              // width={2560}
              // height={1440}
              className={`object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              priority
              onLoadingComplete={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>

      <div className="h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-white text-center px-4">
          Scroll down to see the 3D tilt effect
        </h2>
      </div>
    </div>
  );
}
