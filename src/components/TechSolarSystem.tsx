"use client";

import React, { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import {
  Code,
  Cpu,
  Globe,
  Database,
  Terminal,
  Search,
  Package,
  Settings,
  TrendingUp,
  Smartphone,
  User,
} from "lucide-react";
import useStore from "@/store/store";

// Sun Component
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
      const scale = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FF4500"
        emissiveIntensity={2}
        roughness={0.1}
        metalness={0.8}
      />
      <pointLight intensity={3} distance={50} color="#FFD700" />
    </mesh>
  );
}

// Planet Component
function Planet({
  name,
  color,
  emissive,
  radius,
  distance,
  speed,
  techIcon,
  description,
  rotationSpeed,
  hasRing = false,
  onClick,
}: {
  name: string;
  color: string;
  emissive: string;
  radius: number;
  distance: number;
  speed: number;
  techIcon: React.ReactNode;
  description: string;
  rotationSpeed: number;
  hasRing?: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const orbitRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * speed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * rotationSpeed;
      const scale = hovered ? 1.2 : active ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
    if (ringRef.current && hasRing) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.1, distance + 0.1, 64]} />
        <meshBasicMaterial
          color="#4A5568"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position={[distance, 0, 0]}>
        {hasRing && (
          <mesh ref={ringRef}>
            <ringGeometry args={[radius * 1.5, radius * 2.2, 32]} />
            <meshStandardMaterial
              color="#8B4513"
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}

        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setHovered(true)}
          onPointerUp={() => setHovered(false)}
          onClick={() => {
            onClick();
            setActive(!active);
          }}
        >
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.4}
          />

          <Html distanceFactor={15} center>
            <div className="flex items-center justify-center">
              <div
                className={`p-2 rounded-full backdrop-blur-sm ${
                  hovered ? "bg-black/50" : "bg-transparent"
                }`}
              >
                {techIcon}
              </div>
            </div>
          </Html>
        </mesh>

        <Text
          position={[0, radius + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {name}
        </Text>

        {active && (
          <Html distanceFactor={10} position={[0, radius + 1.5, 0]}>
            <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg max-w-xs border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                {techIcon}
                <h3 className="font-bold text-white">{name}</h3>
              </div>
              <p className="text-gray-300 text-sm">{description}</p>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// Main Solar System Component
export default function TechSolarSystem() {
  const { isDarkMode } = useStore();
  const [activePlanet, setActivePlanet] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [discoveredEasterEggs, setDiscoveredEasterEggs] = useState<string[]>(
    []
  );
  const [earthClicks, setEarthClicks] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);

  const [isMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    const isMobileViewport = window.innerWidth < 768;
    const isCoarsePointer = window.matchMedia
      ? window.matchMedia("(pointer: coarse)").matches
      : false;
    return isMobileViewport || isCoarsePointer;
  });

  const planets = [
    {
      name: "React",
      color: "#61DAFB",
      emissive: "#2D79A7",
      radius: 0.5,
      distance: 2.5,
      speed: 0.3,
      rotationSpeed: 0.4,
      techIcon: <Code size={16} className="text-[#61DAFB]" />,
      description: "UI Library - Component-based architecture",
    },
    {
      name: "NodeJS",
      color: "#68A063",
      emissive: "#3C873A",
      radius: 0.6,
      distance: 4,
      speed: 0.25,
      rotationSpeed: 0.3,
      techIcon: <Cpu size={16} className="text-[#68A063]" />,
      description: "Runtime - Server-side JavaScript",
    },
    {
      name: "TypeScript",
      color: "#3178C6",
      emissive: "#235A97",
      radius: 0.55,
      distance: 5.5,
      speed: 0.2,
      rotationSpeed: 0.5,
      techIcon: <Terminal size={16} className="text-[#3178C6]" />,
      description: "Superset - Static typing for JS",
    },
    {
      name: "Edge Functions",
      color: "#3ECF8E",
      emissive: "#2EBF7E",
      radius: 0.45,
      distance: 6.5,
      speed: 0.18,
      rotationSpeed: 0.7,
      techIcon: <Search size={16} className="text-[#3ECF8E]" />,
      description: "Serverless - Edge computing functions",
    },
    {
      name: "Supabase",
      color: "#3ECF8E",
      emissive: "#2EBF7E",
      radius: 0.7,
      distance: 7,
      speed: 0.15,
      rotationSpeed: 0.2,
      hasRing: true,
      techIcon: <Database size={16} className="text-[#3ECF8E]" />,
      description: "Backend - Database & Auth service",
    },
    {
      name: "Earth (Developer)",
      color: "#4A90E2",
      emissive: "#357ABD",
      radius: 0.8,
      distance: 4,
      speed: 0.2,
      rotationSpeed: 0.3,
      hasRing: true,
      isSpecial: true,
      techIcon: <User size={16} className="text-[#4A90E2]" />,
      description: "Developer - Click to explore hidden achievements!",
      hiddenFeatures: ["secret_code", "easter_egg", "achievement_unlock"],
    },
    {
      name: "Docker",
      color: "#2496ED",
      emissive: "#0073EC",
      radius: 0.6,
      distance: 8.5,
      speed: 0.12,
      rotationSpeed: 0.4,
      techIcon: <Package size={16} className="text-[#2496ED]" />,
      description: "DevOps - Container platform",
    },
    {
      name: "Kubernetes",
      color: "#326CE5",
      emissive: "#2466D9",
      radius: 0.55,
      distance: 10,
      speed: 0.1,
      rotationSpeed: 0.3,
      techIcon: <Package size={16} className="text-[#326CE5]" />,
      description: "DevOps - Container orchestration",
    },
    {
      name: "Jenkins",
      color: "#D24939",
      emissive: "#B83A2A",
      radius: 0.65,
      distance: 11.5,
      speed: 0.08,
      rotationSpeed: 0.5,
      techIcon: <Settings size={16} className="text-[#D24939]" />,
      description: "DevOps - CI/CD automation",
    },
    {
      name: "ThreeJS",
      color: "#049EF4",
      emissive: "#0369A1",
      radius: 0.65,
      distance: 13,
      speed: 0.05,
      rotationSpeed: 0.6,
      techIcon: <Globe size={16} className="text-[#049EF4]" />,
      description: "3D Library - WebGL renderer",
    },
    {
      name: "SEO",
      color: "#34A853",
      emissive: "#2E7D32",
      radius: 0.55,
      distance: 14.5,
      speed: 0.05,
      rotationSpeed: 0.6,
      hasRing: true,
      techIcon: <TrendingUp size={16} className="text-[#34A853]" />,
      description: "Optimization - Search Engine Optimization",
    },
    {
      name: "Mobile Development",
      color: "#61DAFB",
      emissive: "#4FA8C5",
      radius: 0.65,
      distance: 16,
      speed: 0.04,
      rotationSpeed: 0.7,
      techIcon: <Smartphone size={16} className="text-[#61DAFB]" />,
      description: "Mobile - React Native & Flutter apps",
    },
  ];

  const handlePlanetClick = (name: string) => {
    // Special Earth interactions
    if (name === "Earth (Developer)") {
      setEarthClicks((prev) => prev + 1);

      // Achievement: First Earth click
      if (earthClicks === 0) {
        setAchievements((prev) => [...prev, "earth_explorer"]);
        setShowSecretMessage(true);
        setTimeout(() => setShowSecretMessage(false), 3000);
      }

      // Achievement: Earth enthusiast (5 clicks)
      if (earthClicks === 4) {
        setAchievements((prev) => [...prev, "earth_enthusiast"]);
      }

      // Achievement: Earth master (10 clicks)
      if (earthClicks === 9) {
        setAchievements((prev) => [...prev, "earth_master"]);
        setDiscoveredEasterEggs((prev) => [...prev, "secret_code"]);
      }

      // Achievement: Hidden easter egg (25 clicks)
      if (earthClicks === 24) {
        setAchievements((prev) => [...prev, "easter_egg_hunter"]);
        setDiscoveredEasterEggs((prev) => [...prev, "easter_egg"]);
      }
    }

    setActivePlanet(name === activePlanet ? null : name);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <p
        className={`text-xl text-center mb-4 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Explore my technology universe - Interactive 3D solar system
      </p>
      <div
        className={`relative rounded-xl overflow-hidden shadow-2xl w-full ${
          isDarkMode ? "bg-gray-900/50" : "bg-gray-800/90"
        } backdrop-blur-sm border ${
          isDarkMode ? "border-gray-800" : "border-gray-700"
        }`}
        style={{ height: isMobile ? "420px" : "600px" }}
      >
        <Canvas
          camera={{ position: [0, 2, 12], fov: isMobile ? 75 : 65 }}
          dpr={isMobile ? [1, 1.25] : [1, 2]}
          gl={{
            powerPreference: "high-performance",
            antialias: !isMobile,
            alpha: false,
            stencil: false,
            depth: true,
          }}
          touch-action={isMobile ? "none" : "auto"}
          style={{ touchAction: isMobile ? "none" : "auto" }}
        >
          <Suspense fallback={null}>
            <Stars
              radius={100}
              depth={50}
              count={isMobile ? 1500 : 5000}
              factor={isMobile ? 2 : 4}
            />
            <color attach="background" args={["#000011"]} />

            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Sun />

            {planets.map((planet) => (
              <Planet
                key={planet.name}
                {...planet}
                onClick={() => handlePlanetClick(planet.name)}
              />
            ))}

            <OrbitControls
              enablePan={!isMobile}
              enableZoom={!isMobile}
              zoomSpeed={isMobile ? 0.4 : 0.6}
              rotateSpeed={isMobile ? 0.8 : 0.5}
              maxDistance={30}
              minDistance={5}
              autoRotate
              autoRotateSpeed={isMobile ? 0.35 : 0.5}
              enableDamping={true}
              dampingFactor={isMobile ? 0.1 : 0.05}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
            />

            {!isMobile && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  intensity={0.8}
                />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
                <Noise opacity={0.02} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>

        <div className="absolute left-4 top-4 z-20">
          <div
            className={`${
              isDarkMode ? "bg-black/60" : "bg-white/80"
            } backdrop-blur-sm rounded-lg p-3 max-w-xs border ${
              isDarkMode ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <h3
              className={`font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              How to Explore:
            </h3>
            <ul
              className={`text-sm space-y-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>• Click planets for tech details</li>
              <li>• Drag to rotate, scroll to zoom</li>
              <li>• Auto-rotation enabled</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4`}
      >
        {planets.map((planet) => (
          <div
            key={planet.name}
            className={`p-4 rounded-lg backdrop-blur-sm transition-all ${
              activePlanet === planet.name
                ? isDarkMode
                  ? "bg-blue-500/20 border-2 border-blue-500"
                  : "bg-blue-100 border-2 border-blue-600"
                : isDarkMode
                ? "bg-gray-800/50 border border-gray-700 hover:bg-gray-800"
                : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                {planet.techIcon}
              </div>
              <h3
                className={`font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {planet.name}
              </h3>
            </div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {planet.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
