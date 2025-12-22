"use client";

import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Stars,
  Sparkles as DreiSparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { Leva } from "leva";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import {
  ExternalLink,
  Code,
  Cpu,
  Globe,
  Database,
  Rocket,
  Search,
  Terminal,
} from "lucide-react";
import useStore from "@/store/store";
import { toast } from "react-toastify";

// -----------------------
// Solar System Core
// -----------------------
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
    }
    if (materialRef.current) {
      // Pulsing sun effect
      const scale = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current?.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
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

// -----------------------
// Planet Component
// -----------------------
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
  isHabitable = false,
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
  isHabitable?: boolean;
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
      // Orbital motion
      orbitRef.current.rotation.y = t * speed;
    }
    if (meshRef.current) {
      // Planet rotation
      meshRef.current.rotation.y = t * rotationSpeed;

      // Hover effect
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
      {/* Orbit path visualization */}
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
        {/* Ring for gas giants */}
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

        {/* Planet */}
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
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

          {/* Habitable zone indicator */}
          {isHabitable && (
            <DreiSparkles count={20} scale={radius * 2} size={radius * 0.5} />
          )}

          {/* Tech icon floating above planet */}
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

        {/* Planet label */}
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

        {/* Information panel when active */}
        {active && (
          <Html distanceFactor={10} position={[0, radius + 1.5, 0]}>
            <div className="bg-black/80 backdrop-blur-md p-4 rounded-lg max-w-xs border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                {techIcon}
                <h3 className="font-bold text-white">{name}</h3>
              </div>
              <p className="text-gray-300 text-sm">{description}</p>
              <div className="mt-2 text-xs text-gray-400">
                Click to explore tech stack →
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// -----------------------
// Developer Easter Egg: Earth
// -----------------------
function DeveloperEarth({ onClick }: { onClick: () => void }) {
  const earthRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [codeVisible] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.2;

      // Gentle floating animation
      earthRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={earthRef} position={[3.5, 0, 0]}>
      {/* Earth */}
      <mesh
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#10B981"
          emissiveIntensity={hovered ? 1 : 0.3}
          roughness={0.3}
          metalness={0.1}
        />

        {/* Continents pattern */}
        <mesh position={[0, 0, 0.01]}>
          <sphereGeometry args={[0.805, 32, 32]} />
          <meshStandardMaterial color="#10B981" transparent opacity={0.3} />
        </mesh>

        {/* Code particles */}
        {hovered && (
          <DreiSparkles
            count={30}
            scale={2}
            size={0.2}
            speed={0.3}
            color="#60A5FA"
          />
        )}
      </mesh>

      {/* Satellite */}
      <mesh position={[1.2, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.1, 0.05, 0.05]} />
        <meshStandardMaterial color="#FBBF24" emissive="#F59E0B" />
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#9CA3AF" />
        </mesh>
      </mesh>

      {/* Developer label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.25}
        color="#60A5FA"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        Dev World
      </Text>

      {/* Easter egg indicator */}
      <Html distanceFactor={20} position={[0, -1.2, 0]}>
        <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
          <Search size={12} className="text-yellow-400" />
          <span className="text-xs text-white">Easter egg</span>
        </div>
      </Html>

      {/* Hidden code when clicked */}
      {codeVisible && (
        <Html distanceFactor={15} position={[0, 2, 0]}>
          <div className="bg-black/90 backdrop-blur-sm p-4 rounded-lg max-w-sm border border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={16} className="text-green-400" />
              <h3 className="font-mono text-green-400">hiddenCode.js</h3>
            </div>
            <pre className="text-xs text-gray-300">
              {`// Found an easter egg!
function unlockAchievement() {
    console.log('🎉 Senior Dev Mode: Activated');
    return {
        skill: 'Problem Solving++',
        motivation: 'Caffeine Powered',
        secret: 'Always learning'
    };
}`}
            </pre>
            <div className="mt-2 text-xs text-gray-400">
              Type &quot;openSesame&quot; in console for surprise
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// -----------------------
// Tech Satellites
// -----------------------
function TechSatellite({
  position,
  tech,
  icon,
}: {
  position: [number, number, number];
  tech: string;
  icon: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.3;
      ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial
          color={hovered ? "#60A5FA" : "#9CA3AF"}
          emissive={hovered ? "#3B82F6" : "#4B5563"}
          emissiveIntensity={0.5}
        />

        {/* Solar panels */}
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.01]} />
          <meshStandardMaterial color="#1E40AF" />
        </mesh>

        <Html distanceFactor={20} center>
          <div
            className={`p-1 rounded ${
              hovered ? "bg-black/70" : "bg-transparent"
            }`}
          >
            {icon}
          </div>
        </Html>
      </mesh>

      {/* Tech label */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {tech}
      </Text>
    </group>
  );
}

// Comets / Shooting Stars
// -----------------------
function Comets() {
  const count = 5;
  const [comets] = useState(() => {
    const generateComet = () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20
      ),
      speed: 0.5 + Math.random() * 0.5,
      size: 0.05 + Math.random() * 0.1,
    });

    return Array.from({ length: count }, generateComet);
  });

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    comets.forEach((comet, i) => {
      const mesh = refs.current[i];
      if (mesh) {
        // Elliptical motion
        mesh.position.x = Math.cos(t * comet.speed) * 10;
        mesh.position.z = Math.sin(t * comet.speed * 1.3) * 10;
        mesh.position.y = Math.sin(t * comet.speed * 0.7) * 5;

        // Trail effect
        const trail = new THREE.Mesh(
          new THREE.SphereGeometry(comet.size * 0.3),
          new THREE.MeshBasicMaterial({
            color: "#60A5FA",
            transparent: true,
            opacity: 0.3,
          })
        );
        trail.position.copy(mesh.position);
        mesh.parent?.add(trail);

        // Remove trail after delay
        setTimeout(() => {
          trail.removeFromParent();
        }, 100);
      }
    });
  });

  return (
    <>
      {comets.map((comet, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={comet.position}
        >
          <sphereGeometry args={[comet.size, 8, 8]} />
          <meshBasicMaterial color="#60A5FA" />
        </mesh>
      ))}
    </>
  );
}

// -----------------------
// Main Solar System Scene
// -----------------------
export default function TechSolarSystem() {
  const { isDarkMode } = useStore();
  const [activePlanet, setActivePlanet] = useState<string | null>(null);
  const [foundEasterEggs, setFoundEasterEggs] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleInput, setConsoleInput] = useState("");

  // Planet configurations
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
      name: "MongoDB",
      color: "#47A248",
      emissive: "#2E7D32",
      radius: 0.7,
      distance: 7,
      speed: 0.15,
      rotationSpeed: 0.2,
      hasRing: true,
      techIcon: <Database size={16} className="text-[#47A248]" />,
      description: "Database - NoSQL document storage",
    },
    {
      name: "ThreeJS",
      color: "#049EF4",
      emissive: "#0369A1",
      radius: 0.65,
      distance: 8.5,
      speed: 0.12,
      rotationSpeed: 0.6,
      techIcon: <Globe size={16} className="text-[#049EF4]" />,
      description: "3D Library - WebGL renderer",
    },
  ];

  // Satellites configuration
  const satellites = [
    {
      position: [1, 1, 1] as [number, number, number],
      tech: "Vite",
      icon: <Rocket size={12} />,
    },
    {
      position: [-1, 1.5, -1] as [number, number, number],
      tech: "Webpack",
      icon: <Cpu size={12} />,
    },
    {
      position: [2, -1, 0] as [number, number, number],
      tech: "Jest",
      icon: <Code size={12} />,
    },
  ];

  const handlePlanetClick = (name: string) => {
    setActivePlanet(name === activePlanet ? null : name);

    // Easter egg: Click all planets in order
    if (!foundEasterEggs.includes(name)) {
      setFoundEasterEggs((prev) => [...prev, name]);
    }
  };

  const handleEarthClick = () => {
    // Easter egg: Developer console
    if (!foundEasterEggs.includes("earth")) {
      setFoundEasterEggs((prev) => [...prev, "earth"]);
      setShowConsole(true);

      // Auto-hide console after 5 seconds
      setTimeout(() => setShowConsole(false), 5000);
    }
  };

  const handleConsoleSubmit = () => {
    if (consoleInput.toLowerCase() === "opensesame") {
      toast.info("🎉 Achievement Unlocked: Senior Developer Mode!");
      setFoundEasterEggs((prev) => [...prev, "console"]);
      setShowConsole(false);
    }
    setConsoleInput("");
  };

  // Easter egg: Click all planets achievement
  useEffect(() => {
    if (foundEasterEggs.length === planets.length + 1) {
      // +1 for earth
      console.log("🏆 Master Explorer Achievement Unlocked!");
    }
  }, [foundEasterEggs, planets.length]);

  return (
    <section
      id="tech-solar-system"
      className={`py-20 ${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-gray-900 to-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe size={40} className="text-blue-400" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Tech Solar System
            </h2>
            <Rocket size={40} className="text-cyan-400" />
          </div>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-300"
            }`}
          >
            Each planet represents a technology. Click to explore, find hidden
            easter eggs!
          </p>

          {/* Easter egg counter */}
          <div className="mt-4 inline-flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
            <Search size={16} className="text-yellow-400" />
            <span className="text-gray-300">
              Found {foundEasterEggs.length} easter eggs
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div
            className={`relative rounded-xl overflow-hidden shadow-2xl ${
              isDarkMode ? "bg-gray-900" : "bg-gray-800"
            }`}
            style={{ height: "600px" }}
          >
            {/* Controls panel */}
            <div
              style={{ position: "absolute", right: 12, top: 12, zIndex: 30 }}
            >
              <Leva
                collapsed={true}
                theme={{ sizes: { titleBarHeight: "28px" } }}
              />
            </div>

            {/* Console panel */}
            {showConsole && (
              <div className="absolute left-4 bottom-4 z-30 w-80">
                <div className="bg-black/90 backdrop-blur-md rounded-lg border border-green-500 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-green-400" />
                      <span className="text-green-400 font-mono">
                        dev_console
                      </span>
                    </div>
                    <button
                      onClick={() => setShowConsole(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-xs text-gray-300 mb-2">
                    Type &quot;openSesame&quot; to unlock hidden achievement
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={consoleInput}
                      onChange={(e) => setConsoleInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleConsoleSubmit()
                      }
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                      placeholder="Enter command..."
                    />
                    <button
                      onClick={handleConsoleSubmit}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      Run
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Canvas */}
            <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
              <Suspense fallback={null}>
                {/* Background */}
                <Stars radius={100} depth={50} count={5000} factor={4} />
                <color attach="background" args={["#000011"]} />

                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Sun */}
                <Sun />

                {/* Planets */}
                {planets.map((planet) => (
                  <Planet
                    key={planet.name}
                    {...planet}
                    onClick={() => handlePlanetClick(planet.name)}
                  />
                ))}

                {/* Developer Earth (Special Planet) */}
                <DeveloperEarth onClick={handleEarthClick} />

                {/* Tech Satellites */}
                {satellites.map((sat, index) => (
                  <TechSatellite key={index} {...sat} />
                ))}

                {/* Comets */}
                <Comets />

                {/* Camera Controls */}
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  zoomSpeed={0.6}
                  rotateSpeed={0.5}
                  maxDistance={30}
                  minDistance={5}
                  autoRotate
                  autoRotateSpeed={0.5}
                />

                {/* Effects */}
                <EffectComposer>
                  <Bloom
                    luminanceThreshold={0.2}
                    luminanceSmoothing={0.9}
                    intensity={0.8}
                  />
                  <Vignette eskil={false} offset={0.1} darkness={0.5} />
                  <Noise opacity={0.02} />
                </EffectComposer>
              </Suspense>
            </Canvas>

            {/* Instructions */}
            <div className="absolute left-4 top-4 z-20">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 max-w-xs">
                <h3 className="text-white font-semibold mb-2">
                  How to Explore:
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Click planets for tech details</li>
                  <li>• Find the special Developer Earth</li>
                  <li>• Look for hidden easter eggs</li>
                  <li>• Drag to rotate, scroll to zoom</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tech Stack Legend */}
          <div
            className={`mt-8 grid grid-cols-2 md:grid-cols-${planets.length} gap-4`}
          >
            {planets.map((planet) => (
              <div
                key={planet.name}
                className={`p-4 rounded-lg backdrop-blur-sm ${
                  activePlanet === planet.name
                    ? "bg-blue-500/20 border border-blue-500"
                    : "bg-gray-800/50 border border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-gray-700">
                    {planet.techIcon}
                  </div>
                  <h3 className="font-bold text-white">{planet.name}</h3>
                </div>
                <p className="text-sm text-gray-300">{planet.description}</p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="mt-12 text-center">
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                <Globe size={18} />
                Explore My Tech Stack
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => setShowConsole(true)}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-700 transition-all border border-gray-700"
              >
                <Terminal size={18} />
                Open Dev Console
              </button>
            </div>

            <p className="mt-6 text-gray-400 text-sm">
              Made with Three.js • Find all {planets.length + 1} hidden easter
              eggs to unlock achievement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
