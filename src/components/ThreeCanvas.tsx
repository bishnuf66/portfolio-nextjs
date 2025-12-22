"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ThreeCanvas() {
  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const isMobileViewport = window.innerWidth < 768;
    const isCoarsePointer = window.matchMedia
      ? window.matchMedia("(pointer: coarse)").matches
      : false;
    return isMobileViewport || isCoarsePointer;
  });

  return (
    <div className="w-56 h-56 flex items-center justify-center relative">
      {/* 3D Canvas to overlay on top of website */}
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{ powerPreference: "high-performance", antialias: !isMobile }}
        style={{
          width: "100%", // Fill the parent container
          height: "100%", // Fill the parent container
          zIndex: 1, // Ensure it's on top
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Robot isMobile={isMobile} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={!isMobile}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}

function Robot({ isMobile }: { isMobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/robot.glb"); // Load your .glb model

  // Continuous rotation animation
  useFrame((state, delta) => {
    const rotationSpeed = isMobile ? 0.25 : 0.5;
    if (group.current) {
      group.current.rotation.y += delta * rotationSpeed; // Rotate around the Y-axis
    }
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={0.8}
      position={[0, -1, 0]}
      onClick={() => {}}
    />
  );
}
