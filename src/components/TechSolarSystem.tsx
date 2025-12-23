"use client";

import React, {
  useRef,
  Suspense,
  useState,
  useEffect,
  useReducer,
} from "react";
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
  Database,
  Terminal,
  Server,
  Cloud,
  Settings,
  TrendingUp,
  Layers,
  Smartphone,
  Palette,
  Zap,
  HardDrive,
  Image,
  PenTool,
  Brush,
  User,
} from "lucide-react";
import useStore from "@/store/store";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import { colorScheme, getCardClasses } from "@/utils/colorUtils";
import PlanetDetail from "@/components/PlanetDetail";

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

// Reducer for localStorage state management
interface ExplorationState {
  clickedPlanets: Set<string>;
  achievements: string[];
  discoveredEasterEggs: string[];
  earthClicks: number;
}

type ExplorationAction =
  | { type: "LOAD_FROM_STORAGE"; payload: Partial<ExplorationState> }
  | { type: "ADD_CLICKED_PLANET"; payload: string }
  | { type: "ADD_ACHIEVEMENT"; payload: string }
  | { type: "ADD_EASTER_EGG"; payload: string }
  | { type: "INCREMENT_EARTH_CLICKS" };

function explorationReducer(
  state: ExplorationState,
  action: ExplorationAction
): ExplorationState {
  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return {
        ...state,
        ...action.payload,
        clickedPlanets: action.payload.clickedPlanets || new Set(),
      };
    case "ADD_CLICKED_PLANET":
      return {
        ...state,
        clickedPlanets: new Set([...state.clickedPlanets, action.payload]),
      };
    case "ADD_ACHIEVEMENT":
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };
    case "ADD_EASTER_EGG":
      return {
        ...state,
        discoveredEasterEggs: [...state.discoveredEasterEggs, action.payload],
      };
    case "INCREMENT_EARTH_CLICKS":
      return {
        ...state,
        earthClicks: state.earthClicks + 1,
      };
    default:
      return state;
  }
}

// Main Solar System Component
export default function TechSolarSystem() {
  const { isDarkMode } = useStore();
  const [activePlanet, setActivePlanet] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    gradient: string;
    technologies: Array<{
      name: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      color: string;
      description: string;
    }>;
  } | null>(null);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [showAllPlanetsAchievement, setShowAllPlanetsAchievement] =
    useState(false);

  // Use useReducer to manage all localStorage state in one place
  const [explorationState, dispatch] = useReducer(explorationReducer, {
    clickedPlanets: new Set<string>(),
    achievements: [],
    discoveredEasterEggs: [],
    earthClicks: 0,
  });

  // Load exploration state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedExplored = localStorage.getItem("exploredPlanets");
      const savedAchievements = localStorage.getItem("planetAchievements");
      const savedEasterEggs = localStorage.getItem("discoveredEasterEggs");
      const savedEarthClicks = localStorage.getItem("earthClicks");

      // Single dispatch to load all state at once
      dispatch({
        type: "LOAD_FROM_STORAGE",
        payload: {
          clickedPlanets: savedExplored
            ? new Set(JSON.parse(savedExplored))
            : new Set(),
          achievements: savedAchievements ? JSON.parse(savedAchievements) : [],
          discoveredEasterEggs: savedEasterEggs
            ? JSON.parse(savedEasterEggs)
            : [],
          earthClicks: savedEarthClicks ? parseInt(savedEarthClicks, 10) : 0,
        },
      });
    }
  }, []);

  // Save exploration state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "exploredPlanets",
        JSON.stringify(Array.from(explorationState.clickedPlanets))
      );
      localStorage.setItem(
        "planetAchievements",
        JSON.stringify(explorationState.achievements)
      );
      localStorage.setItem(
        "discoveredEasterEggs",
        JSON.stringify(explorationState.discoveredEasterEggs)
      );
      localStorage.setItem(
        "earthClicks",
        explorationState.earthClicks.toString()
      );
    }
  }, [explorationState]);

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
      name: "Frontend Development",
      color: "#8C7853",
      emissive: "#6B5D54",
      radius: 0.3,
      distance: 2.5,
      speed: 0.48,
      rotationSpeed: 0.4,
      techIcon: <Code size={16} className="text-[#8C7853]" />,
      description: "React, Next.js, TypeScript, Tailwind CSS",
    },
    {
      name: "Mobile Development",
      color: "#FFC649",
      emissive: "#E6A833",
      radius: 0.45,
      distance: 3.5,
      speed: 0.35,
      rotationSpeed: 0.3,
      techIcon: <Smartphone size={16} className="text-[#FFC649]" />,
      description: "React Native, Flutter, iOS, Android",
    },
    {
      name: "Backend Development",
      color: "#4A90E2",
      emissive: "#357ABD",
      radius: 0.5,
      distance: 4.5,
      speed: 0.3,
      rotationSpeed: 0.5,
      techIcon: <Cpu size={16} className="text-[#4A90E2]" />,
      description: "Node.js, Supabase, Edge Functions, Next.js",
    },
    {
      name: "Database Systems",
      color: "#CD5C5C",
      emissive: "#B22222",
      radius: 0.35,
      distance: 5.5,
      speed: 0.24,
      rotationSpeed: 0.7,
      techIcon: <Database size={16} className="text-[#CD5C5C]" />,
      description: "MongoDB, MySQL, PostgreSQL, QTA",
    },
    {
      name: "Caching Systems",
      color: "#DAA520",
      emissive: "#B8860B",
      radius: 0.9,
      distance: 7.5,
      speed: 0.13,
      rotationSpeed: 0.6,
      techIcon: <Zap size={16} className="text-[#DAA520]" />,
      description: "Redis, Cassandra, Memcached, Elasticsearch",
    },
    {
      name: "UI/UX Design",
      color: "#F4E4C1",
      emissive: "#D4A76A",
      radius: 0.75,
      distance: 9.5,
      speed: 0.09,
      rotationSpeed: 0.4,
      hasRing: true,
      techIcon: <PenTool size={16} className="text-[#F4E4C1]" />,
      description: "Figma, Canva, Adobe XD, Sketch",
    },
    {
      name: "Cloud Infrastructure",
      color: "#4FD0E7",
      emissive: "#3BA0B5",
      radius: 0.55,
      distance: 11.5,
      speed: 0.07,
      rotationSpeed: 0.3,
      techIcon: <Cloud size={16} className="text-[#4FD0E7]" />,
      description: "AWS EC2, AWS S3, Azure, VPS Hosting",
    },
    {
      name: "Analytics & Storage",
      color: "#4B70DD",
      emissive: "#3A5FCD",
      radius: 0.52,
      distance: 13.5,
      speed: 0.05,
      rotationSpeed: 0.2,
      techIcon: <TrendingUp size={16} className="text-[#4B70DD]" />,
      description: "Google Analytics, Data Insights, PWA, Search Optimization",
    },
    {
      name: "Developer Earth",
      color: "#4A90E2",
      emissive: "#357ABD",
      radius: 0.8,
      distance: 16,
      speed: 0.03,
      rotationSpeed: 0.3,
      hasRing: true,
      isSpecial: true,
      techIcon: <User size={16} className="text-[#4A90E2]" />,
      description: "Developer - Click to explore hidden achievements!",
      hiddenFeatures: ["secret_code", "easter_egg", "achievement_unlock"],
    },
  ];

  const techCategories = [
    {
      title: "Frontend Development",
      gradient: "from-blue-500 to-cyan-500",
      technologies: [
        {
          name: "React",
          icon: Code,
          color: "#61DAFB",
          description: "UI Library",
        },
        {
          name: "Next.js",
          icon: Layers,
          color: "#000000",
          description: "React Framework",
        },
        {
          name: "TypeScript",
          icon: Terminal,
          color: "#3178C6",
          description: "Type Safety",
        },
        {
          name: "Tailwind CSS",
          icon: Palette,
          color: "#06B6D4",
          description: "Styling",
        },
      ],
    },
    {
      title: "Mobile Development",
      gradient: "from-indigo-500 to-purple-500",
      technologies: [
        {
          name: "React Native",
          icon: Smartphone,
          color: "#61DAFB",
          description: "Cross-Platform Mobile",
        },
        {
          name: "Flutter",
          icon: Smartphone,
          color: "#02569B",
          description: "Google's UI Toolkit",
        },
        {
          name: "iOS Development",
          icon: Smartphone,
          color: "#007AFF",
          description: "Native iOS Apps",
        },
        {
          name: "Android Development",
          icon: Smartphone,
          color: "#3DDC84",
          description: "Native Android Apps",
        },
      ],
    },
    {
      title: "Backend Development",
      gradient: "from-green-500 to-emerald-500",
      technologies: [
        {
          name: "Node.js",
          icon: Cpu,
          color: "#68A063",
          description: "Runtime",
        },
        {
          name: "Supabase",
          icon: Database,
          color: "#3ECF8E",
          description: "Backend as a Service",
        },
        {
          name: "Edge Functions",
          icon: Zap,
          color: "#3ECF8E",
          description: "Serverless Functions",
        },
        {
          name: "Next.js",
          icon: Layers,
          color: "#000000",
          description: "Full-stack Framework",
        },
      ],
    },
    {
      title: "Database Systems",
      gradient: "from-blue-500 to-indigo-500",
      technologies: [
        {
          name: "MongoDB",
          icon: Database,
          color: "#47A248",
          description: "NoSQL Database",
        },
        {
          name: "MySQL",
          icon: Database,
          color: "#4479A1",
          description: "SQL Database",
        },
        {
          name: "PostgreSQL",
          icon: Database,
          color: "#336791",
          description: "SQL Database",
        },
        {
          name: "QTA",
          icon: Database,
          color: "#FF6B35",
          description: "Query Analytics",
        },
      ],
    },
    {
      title: "Caching Systems",
      gradient: "from-red-500 to-orange-500",
      technologies: [
        {
          name: "Redis",
          icon: Zap,
          color: "#DC382D",
          description: "In-memory Cache",
        },
        {
          name: "Cassandra",
          icon: Database,
          color: "#1287BF",
          description: "Distributed Database",
        },
        {
          name: "Memcached",
          icon: HardDrive,
          color: "#9B59B6",
          description: "Memory Cache",
        },
        {
          name: "Elasticsearch",
          icon: Server,
          color: "#005571",
          description: "Search & Analytics",
        },
      ],
    },
    {
      title: "Cloud Infrastructure",
      gradient: "from-purple-500 to-pink-500",
      technologies: [
        {
          name: "AWS EC2",
          icon: Server,
          color: "#FF9900",
          description: "Virtual Servers",
        },
        {
          name: "AWS S3",
          icon: HardDrive,
          color: "#FF9900",
          description: "Object Storage",
        },
        {
          name: "Azure",
          icon: Cloud,
          color: "#0078D4",
          description: "Microsoft Cloud",
        },
        {
          name: "VPS Hosting",
          icon: Server,
          color: "#FF6B35",
          description: "Virtual Private Server",
        },
      ],
    },
    {
      title: "Analytics & Storage",
      gradient: "from-indigo-500 to-purple-500",
      technologies: [
        {
          name: "Supabase Storage",
          icon: HardDrive,
          color: "#3ECF8E",
          description: "File Storage",
        },
        {
          name: "Cloudinary",
          icon: Image,
          color: "#3448C5",
          description: "Media Management",
        },
        {
          name: "MongoDB",
          icon: Database,
          color: "#47A248",
          description: "NoSQL Database",
        },
        {
          name: "cPanel",
          icon: Settings,
          color: "#FF6C2C",
          description: "Hosting Management",
        },
      ],
    },
    {
      title: "UI/UX Design",
      gradient: "from-pink-500 to-rose-500",
      technologies: [
        {
          name: "Figma",
          icon: PenTool,
          color: "#F24E1E",
          description: "Design Tool",
        },
        {
          name: "Canva",
          icon: Brush,
          color: "#00C4CC",
          description: "Graphic Design",
        },
        {
          name: "Adobe XD",
          icon: PenTool,
          color: "#FF61F6",
          description: "UI Design",
        },
        {
          name: "Sketch",
          icon: Brush,
          color: "#F7B500",
          description: "Digital Design",
        },
      ],
    },
  ];

  const handlePlanetClick = (name: string) => {
    // Track clicked planets for achievement
    dispatch({ type: "ADD_CLICKED_PLANET", payload: name });

    // Check if all planets have been clicked for achievement
    if (
      explorationState.clickedPlanets.size + 1 === planets.length &&
      !showAllPlanetsAchievement
    ) {
      dispatch({ type: "ADD_ACHIEVEMENT", payload: "all_planets_explored" });
      setShowAllPlanetsAchievement(true);
      setTimeout(() => setShowAllPlanetsAchievement(false), 5000);
    }

    // Find the corresponding category
    const category = techCategories.find((cat) => cat.title === name);

    if (category) {
      // Show category details
      setSelectedCategory(category);
    } else if (name === "Developer Earth") {
      // Special Earth interactions
      dispatch({ type: "INCREMENT_EARTH_CLICKS" });

      // Achievement: First Earth click
      if (explorationState.earthClicks === 0) {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: "earth_explorer" });
        setShowSecretMessage(true);
        setTimeout(() => setShowSecretMessage(false), 3000);
      }

      // Achievement: Earth enthusiast (5 clicks)
      if (explorationState.earthClicks === 4) {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: "earth_enthusiast" });
      }

      // Achievement: Earth master (10 clicks)
      if (explorationState.earthClicks === 9) {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: "earth_master" });
        dispatch({ type: "ADD_EASTER_EGG", payload: "secret_code" });
      }

      // Achievement: Hidden easter egg (25 clicks)
      if (explorationState.earthClicks === 24) {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: "easter_egg_hunter" });
        dispatch({ type: "ADD_EASTER_EGG", payload: "easter_egg" });
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

      {/* Tech Stack Grid Cards */}
      <div className="mt-12">
        <AnimatedSection animation="fadeIn" className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Explored Technology Categories
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {explorationState.clickedPlanets.size === 0
              ? "Click on planets to explore and unlock technology categories"
              : `You've explored ${explorationState.clickedPlanets.size} of ${planets.length} technology categories`}
          </p>
        </AnimatedSection>

        {explorationState.clickedPlanets.size > 0 && (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            staggerDelay={0.15}
          >
            {techCategories
              .filter((category) => {
                const hasMatchingPlanet = explorationState.clickedPlanets.has(
                  category.title
                );

                return (
                  hasMatchingPlanet && category.title !== "Developer Earth"
                );
              })
              .map((category, categoryIndex) => {
                return (
                  <div
                    key={categoryIndex}
                    className={`${getCardClasses(
                      "rounded-2xl p-8 border hover:shadow-2xl transition-all duration-300"
                    )}`}
                  >
                    <div className="mb-6">
                      <h3
                        className={`text-2xl font-bold mb-2 bg-linear-to-r ${category.gradient} bg-clip-text text-transparent`}
                      >
                        {category.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          Explored
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {category.technologies.map((tech, techIndex) => {
                        const Icon = tech.icon;
                        return (
                          <div
                            key={techIndex}
                            className={`p-4 rounded-xl ${colorScheme.background.tertiary} hover:scale-105 transition-all duration-300 group cursor-pointer`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${tech.color}20` }}
                              >
                                <Icon size={20} style={{ color: tech.color }} />
                              </div>
                              <div>
                                <h4
                                  className={`font-semibold ${
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {tech.name}
                                </h4>
                              </div>
                            </div>
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {tech.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </StaggeredContainer>
        )}
      </div>

      {/* Planet Detail Modal */}
      {selectedCategory && (
        <PlanetDetail
          category={selectedCategory}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {/* Achievement Notifications */}
      {showAllPlanetsAchievement && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">Achievement Unlocked!</h3>
          <p>
            All Planets Explored - You&apos;ve discovered all technology
            categories!
          </p>
        </div>
      )}

      {/* Secret Message */}
      {showSecretMessage && (
        <div className="fixed top-20 right-4 z-50 bg-purple-500 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">Secret Found!</h3>
          <p>Welcome, Explorer! Keep clicking to discover more secrets...</p>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/50 text-white p-2 rounded text-xs">
          <div>
            Clicked Planets:{" "}
            {Array.from(explorationState.clickedPlanets).join(", ")}
          </div>
          <div>Achievements: {explorationState.achievements.length}</div>
          <div>Easter Eggs: {explorationState.discoveredEasterEggs.length}</div>
        </div>
      )}
    </div>
  );
}
