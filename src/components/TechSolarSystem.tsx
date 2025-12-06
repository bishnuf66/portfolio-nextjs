"use client";

import React, { useRef, Suspense, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    Text,
    Html,
    Stars,
    Sparkles as DreiSparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { Code, Cpu, Globe, Database, Terminal, Search } from "lucide-react";
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
                            <div className={`p-2 rounded-full backdrop-blur-sm ${hovered ? 'bg-black/50' : 'bg-transparent'}`}>
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

    const handlePlanetClick = (name: string) => {
        setActivePlanet(name === activePlanet ? null : name);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div
                className={`relative rounded-xl overflow-hidden shadow-2xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-800/90"
                    } backdrop-blur-sm border ${isDarkMode ? "border-gray-800" : "border-gray-700"}`}
                style={{ height: "600px" }}
            >
                <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
                    <Suspense fallback={null}>
                        <Stars radius={100} depth={50} count={5000} factor={4} />
                        <color attach="background" args={['#000011']} />

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
                            enablePan={true}
                            enableZoom={true}
                            zoomSpeed={0.6}
                            rotateSpeed={0.5}
                            maxDistance={30}
                            minDistance={5}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />

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

                <div className="absolute left-4 top-4 z-20">
                    <div className={`${isDarkMode ? "bg-black/60" : "bg-white/80"
                        } backdrop-blur-sm rounded-lg p-3 max-w-xs border ${isDarkMode ? "border-gray-700" : "border-gray-300"
                        }`}>
                        <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            How to Explore:
                        </h3>
                        <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            <li>• Click planets for tech details</li>
                            <li>• Drag to rotate, scroll to zoom</li>
                            <li>• Auto-rotation enabled</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={`mt-8 grid grid-cols-2 md:grid-cols-5 gap-4`}>
                {planets.map((planet) => (
                    <div
                        key={planet.name}
                        className={`p-4 rounded-lg backdrop-blur-sm transition-all ${activePlanet === planet.name
                                ? isDarkMode
                                    ? 'bg-blue-500/20 border-2 border-blue-500'
                                    : 'bg-blue-100 border-2 border-blue-600'
                                : isDarkMode
                                    ? 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
                                    : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                                {planet.techIcon}
                            </div>
                            <h3 className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {planet.name}
                            </h3>
                        </div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {planet.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
