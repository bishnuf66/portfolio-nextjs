
"use client";

import React, { useRef, Suspense, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    MeshDistortMaterial,
    Stars,
    Html,
    Sparkles as DreiSparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { Leva, useControls } from "leva";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import { MotionValue, motion, useSpring } from "framer-motion";
import { Sparkles, Github, ExternalLink } from "lucide-react";
import useStore from "@/store/store";

// --- Helper: map range
const map = (v: number, a: number, b: number, c: number, d: number) =>
    c + ((v - a) * (d - c)) / (b - a);

// -----------------------
// Interactive Morphing Sphere
// -----------------------
function MorphingSphere({
    mouse,
    hoverIntensity,
    params,
}: {
    mouse: THREE.Vector2;
    hoverIntensity: number;
    params: any;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);
    const { clock } = useThree();

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        if (meshRef.current) {
            // gentle rotation with additional subtle noise for "organic" motion
            meshRef.current.rotation.x = t * 0.15;
            meshRef.current.rotation.y = t * 0.25;

            // magnet-like reaction to mouse: sphere tilts toward mouse pointer
            const targetX = map(mouse.x, -1, 1, -0.6, 0.6);
            const targetY = map(mouse.y, -1, 1, -0.4, 0.4);
            meshRef.current.rotation.y += (targetX - meshRef.current.rotation.y) * 0.05;
            meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.05;

            // breathing scale + hover amplification
            const baseScale = 1 + Math.sin(t * params.breathSpeed) * params.breathAmount;
            const scale = baseScale + hoverIntensity * params.hoverScaleBoost;
            meshRef.current.scale.set(scale, scale, scale);
        }

        // dynamic color shift + fresnel-like metal sheen
        if (materialRef.current) {
            const hue = (t * params.colorSpeed + mouse.x * 0.15) % 1;
            materialRef.current.color.setHSL(0.68 - hue * 0.15, 0.8, 0.55);
            materialRef.current.metalness = params.metalness;
            materialRef.current.roughness = params.roughness;
            materialRef.current.distort = params.distortBase + hoverIntensity * params.distortHover;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1.6, 128, 128]} />
            <MeshDistortMaterial
                ref={materialRef}
                color="#667eea"
                attach="material"
                distort={0.35}
                speed={2}
                roughness={0.2}
                metalness={0.8}
                toneMapped={true}
            />
        </mesh>
    );
}

// -----------------------
// Orbiting Particles with trails
// -----------------------
function OrbitingParticles({ mouse, params }: { mouse: THREE.Vector2; params: any }) {
    const groupRef = useRef<THREE.Group>(null);
    // prepare random offsets
    const particles = useMemo(() => {
        return Array.from({ length: params.count }, (_, i) => {
            const angle = (i / params.count) * Math.PI * 2;
            const radius = 3 + Math.sin(i * 0.5) * 0.6;
            return {
                angle,
                radius,
                y: (Math.sin(i * 0.3) * 0.8) + (Math.random() - 0.5) * 0.4,
                speed: 0.2 + Math.random() * 0.8,
                size: 0.04 + Math.random() * 0.06,
                color: new THREE.Color().setHSL((i / params.count) * 0.9, 0.9, 0.6),
            };
        });
    }, [params.count]);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (groupRef.current) {
            // slow group rotation, influenced by mouse x
            groupRef.current.rotation.y = t * 0.08 + mouse.x * 0.5;
            groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.08 + mouse.y * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => {
                // position updated in render using sin for dynamic effect
                const x = Math.cos(p.angle) * p.radius;
                const z = Math.sin(p.angle) * p.radius;
                return (
                    <mesh
                        key={i}
                        position={[x, p.y + Math.sin(i + Date.now() * 0.0005) * 0.02, z]}
                        rotation={[0, 0, 0]}
                        scale={[p.size, p.size, p.size]}
                    >
                        <sphereGeometry args={[1, 8, 8]} />
                        <meshStandardMaterial
                            emissive={p.color}
                            emissiveIntensity={1.2}
                            metalness={0.5}
                            roughness={0.1}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

// -----------------------
// Click Ripple / Shockwave
// -----------------------
function Ripples({ ripples }: { ripples: { id: number; pos: THREE.Vector3; start: number }[] }) {
    // Render expanding transparent rings
    return (
        <>
            {ripples.map((r) => {
                const age = (performance.now() - r.start) / 1000;
                const size = 0.5 + age * 3;
                const opacity = Math.max(0, 0.8 - age * 0.6);
                return (
                    <mesh key={r.id} position={[r.pos.x, r.pos.y, r.pos.z]}>
                        <ringGeometry args={[size * 0.9, size, 64]} />
                        <meshBasicMaterial
                            transparent
                            depthWrite={false}
                            opacity={opacity}
                            side={THREE.DoubleSide}
                            toneMapped={false}
                        />
                    </mesh>
                );
            })}
        </>
    );
}

// -----------------------
// Camera rig (scroll + subtle drift)
// -----------------------
function CameraRig({ scrollY, params }: { scrollY: number; params: any }) {
    const { camera } = useThree();
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // zoom based on scroll and subtle sinus drift
        const zoom = map(scrollY, 0, 1, params.zoomMin, params.zoomMax) + Math.sin(t * 0.35) * 0.15;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoom, 0.08);

        // slight orbit
        camera.position.x = Math.sin(t * 0.12) * 0.4;
        camera.position.y = Math.cos(t * 0.07) * 0.18 + map(scrollY, 0, 1, 0, -0.2);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// -----------------------
// Starfield / Warp background
// -----------------------
function Starfield({ warp }: { warp: number }) {
    // create a points field that accelerates when warp > 0
    const ref = useRef<any>(null);
    const count = 2000;
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = THREE.MathUtils.randFloatSpread(200);
            arr[i * 3] = THREE.MathUtils.randFloatSpread(120);
            arr[i * 3 + 1] = THREE.MathUtils.randFloatSpread(60);
            arr[i * 3 + 2] = THREE.MathUtils.randFloat(200) * -1;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            let z = positions[i * 3 + 2];
            z += 0.6 + warp * 6; // warp accelerates z movement
            if (z > 10) z = -300 - Math.random() * 200;
            positions[i * 3 + 2] = z;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.8} sizeAttenuation transparent opacity={0.9} />
        </points>
    );
}

// -----------------------
// Full Scene wrapper
// -----------------------
export default function UpgradedThreeShowcase() {
    const { isDarkMode } = useStore();
    // Mouse normalized -1..1
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const [hoverIntensity, setHoverIntensity] = useState(0);
    const [ripples, setRipples] = useState<{ id: number; pos: THREE.Vector3; start: number }[]>([]);
    const [ripplesTick, setRipplesTick] = useState(0); // to force re-render for ripples
    const [scrollY, setScrollY] = useState(0);
    const rippleIdRef = useRef(1);
    const [warp, setWarp] = useState(0);

    // Leva controls
    const params = useControls({
        // sphere
        breathSpeed: { value: 1.0, min: 0.1, max: 3, step: 0.1 },
        breathAmount: { value: 0.06, min: 0, max: 0.4, step: 0.01 },
        hoverScaleBoost: { value: 0.12, min: 0, max: 0.6, step: 0.01 },
        distortBase: { value: 0.35, min: 0, max: 1.6, step: 0.01 },
        distortHover: { value: 0.9, min: 0, max: 2.5, step: 0.01 },
        metalness: { value: 0.9, min: 0, max: 1, step: 0.01 },
        roughness: { value: 0.18, min: 0, max: 1, step: 0.01 },
        colorSpeed: { value: 0.08, min: 0, max: 1, step: 0.01 },

        // particles
        particleCount: { value: 80, min: 8, max: 600, step: 1 },
        // camera
        zoomMin: { value: 5.2, min: 3, max: 12, step: 0.1 },
        zoomMax: { value: 7.6, min: 4, max: 16, step: 0.1 },
        // star warp
        warpPower: { value: 0.0, min: 0, max: 1, step: 0.01 },
        // misc
        bloomIntensity: { value: 0.8, min: 0, max: 2, step: 0.01 },
        dofFocus: { value: 2.5, min: 0.1, max: 12, step: 0.1 },
    });

    // Listen for scroll to drive camera zoom and depth
    useEffect(() => {
        const handler = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const y = docHeight <= 0 ? 0 : window.scrollY / docHeight;
            setScrollY(y);
        };
        handler();
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Mouse handlers
    const handlePointerMove = (e: React.PointerEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseRef.current.set(x, y);
    };

    const handlePointerEnter = () => {
        // soft ramp for hover intensity
        setHoverIntensity(0.6);
    };
    const handlePointerLeave = () => {
        setHoverIntensity(0);
    };

    const handleClick = (e: React.MouseEvent) => {
        // convert screen coords to world pos on z=0 plane
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        // unproject to world coords
        const vec = new THREE.Vector3(x, y, 0.5);
        const camera = (window as any).__THREE_CAMERA__ as THREE.Camera | undefined;
        if (camera) {
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            // spawn ripple
            const id = rippleIdRef.current++;
            setRipples((r) => [...r, { id, pos, start: performance.now() }]);
            // remove after 1.8s
            setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 1800);
            setRipplesTick((t) => t + 1);

            // small warp burst when clicking
            setWarp(1.2);
            setTimeout(() => setWarp(0), 700);
        }
    };

    // Provide camera to global (for click unproject convenience)
    function CameraProviderMarker() {
        const { camera } = useThree();
        useEffect(() => {
            (window as any).__THREE_CAMERA__ = camera;
            return () => {
                (window as any).__THREE_CAMERA__ = undefined;
            };
        }, [camera]);
        return null;
    }

    // Clean ripples older than 2s periodically
    useEffect(() => {
        const id = setInterval(() => {
            const now = performance.now();
            setRipples((r) => r.filter((x) => now - x.start < 2200));
        }, 800);
        return () => clearInterval(id);
    }, []);

    return (
        <section
            id="threejs-showcase"
            className={`py - 20 ${isDarkMode ? "bg-gray-900" : "bg-white"} `}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles size={40} className="text-purple-500" />
                        <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                            Three.js Showcase — Interactive Mix
                        </h2>
                    </div>
                    <p className={`text - lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} `}>
                        Bloom, warp stars, cursor magnetism, click ripples, particle trails, and live controls.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div
                        className={`relative rounded - xl overflow - hidden shadow - 2xl ${isDarkMode ? "bg-gray-900" : "bg-gray-800"} `}
                        style={{ height: "560px" }}
                        onPointerMove={handlePointerMove}
                        onPointerEnter={handlePointerEnter}
                        onPointerLeave={handlePointerLeave}
                        onClick={handleClick}
                    >
                        {/* Live controls (top-right) */}
                        <div style={{ position: "absolute", right: 12, top: 12, zIndex: 30 }}>
                            <Leva collapsed={true} />
                        </div>

                        {/* Canvas */}
                        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                            <CameraProviderMarker />
                            <Suspense fallback={null}>
                                {/* postprocessing + lights */}
                                <ambientLight intensity={0.45} />
                                <pointLight position={[10, 10, 6]} intensity={1.2} />
                                <pointLight position={[-8, -6, -6]} intensity={0.6} color={"#667eea"} />

                                <Starfield warp={warp * params.warpPower} />
                                <OrbitingParticles mouse={mouseRef.current} params={{ count: params.particleCount }} />

                                <MorphingSphere mouse={mouseRef.current} hoverIntensity={hoverIntensity} params={params} />

                                {/* ripples (rings) */}
                                <Ripples ripples={ripples} />

                                {/* subtle sparkles */}
                                <DreiSparkles count={60} scale={[4, 2, 4]} />

                                <CameraRig scrollY={scrollY} params={{ zoomMin: params.zoomMin, zoomMax: params.zoomMax }} />

                                {/* controls for exploring */}
                                <OrbitControls enablePan={false} enableZoom={true} maxDistance={20} minDistance={3.5} />

                                {/* Effects */}
                                <EffectComposer>
                                    <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={params.bloomIntensity} />
                                    <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={3} height={480} />
                                    <Noise opacity={0.02} />
                                    <Vignette eskil={false} offset={0.1} darkness={0.35} />
                                </EffectComposer>
                            </Suspense>
                        </Canvas>

                        {/* small UI overlay text */}
                        <div className="absolute left-6 bottom-6 z-20 text-sm">
                            <div className={`rounded - md px - 3 py - 2 ${isDarkMode ? "bg-black/40 text-gray-200" : "bg-white/30 text-gray-900"} `}>
                                <div>🖱️ Drag • 🔍 Scroll • ✨ Click for ripple & warp</div>
                                <div className="mt-1 text-xs opacity-80">Tip: expand the Leva panel (top-right) to tweak parameters live.</div>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className={`mt - 6 text - center ${isDarkMode ? "text-gray-300" : "text-gray-700"} `}>
                        <p className="text-sm mb-4">Want to tweak effects? Use the control panel top-right.</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <a
                                href="https://github.com/bishnuf66"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline - flex items - center gap - 2 px - 6 py - 3 rounded - lg font - semibold transition - all ${isDarkMode
                                        ? "bg-gray-700 text-white hover:bg-gray-600"
                                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                                    } shadow - lg`}
                            >
                                <Github size={18} />
                                View My GitHub
                                <ExternalLink size={14} />
                            </a>

                            <a
                                href="https://github.com/bishnuf66"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            >
                                <Sparkles size={18} />
                                Source Code
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
