"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import useStore from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, RotateCcw, Play, Pause, X } from "lucide-react";

// Spaceship Component
function Spaceship({ position }: { position: [number, number, number] }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group position={position}>
            {/* Main body */}
            <mesh ref={meshRef}>
                <coneGeometry args={[0.5, 1.5, 4]} />
                <meshStandardMaterial color="#4299e1" emissive="#2b6cb0" emissiveIntensity={0.5} />
            </mesh>
            {/* Wings */}
            <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.1, 0.3]} />
                <meshStandardMaterial color="#667eea" />
            </mesh>
            <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.8, 0.1, 0.3]} />
                <meshStandardMaterial color="#667eea" />
            </mesh>
            {/* Cockpit */}
            <mesh position={[0, 0.3, 0.3]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#f6ad55" emissive="#ed8936" emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
}

// Asteroid Component
function Asteroid({ position, speed, onCollision }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isActive, setIsActive] = useState(true);

    useFrame(() => {
        if (meshRef.current && isActive) {
            meshRef.current.position.z += speed;
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;

            // Check if asteroid is past the camera
            if (meshRef.current.position.z > 5) {
                setIsActive(false);
                onCollision(false); // Missed asteroid
            }
        }
    });

    if (!isActive) return null;

    return (
        <mesh ref={meshRef} position={position}>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#e53e3e" roughness={0.8} />
        </mesh>
    );
}

// Collectible Star Component
function CollectibleStar({ position, speed, onCollect }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isActive, setIsActive] = useState(true);

    useFrame((state) => {
        if (meshRef.current && isActive) {
            meshRef.current.position.z += speed;
            meshRef.current.rotation.y += 0.05;
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.01;

            // Check if star is past the camera
            if (meshRef.current.position.z > 5) {
                setIsActive(false);
            }
        }
    });

    if (!isActive) return null;

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={() => {
                setIsActive(false);
                onCollect();
            }}
        >
            <octahedronGeometry args={[0.3, 0]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffa500" emissiveIntensity={1} />
        </mesh>
    );
}

// Game Scene Component
function GameScene({
    shipPosition,
    asteroids,
    stars,
    onAsteroidCollision,
    onStarCollect,
}: any) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Spaceship position={shipPosition} />

            {asteroids.map((asteroid: any) => (
                <Asteroid
                    key={asteroid.id}
                    position={asteroid.position}
                    speed={asteroid.speed}
                    onCollision={onAsteroidCollision}
                />
            ))}

            {stars.map((star: any) => (
                <CollectibleStar
                    key={star.id}
                    position={star.position}
                    speed={star.speed}
                    onCollect={onStarCollect}
                />
            ))}
        </>
    );
}

// Main Game Component
export default function SpaceShooterGame() {
    const { isDarkMode } = useStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [shipPosition, setShipPosition] = useState<[number, number, number]>([0, 0, 3]);
    const [asteroids, setAsteroids] = useState<any[]>([]);
    const [stars, setStars] = useState<any[]>([]);
    const [showInstructions, setShowInstructions] = useState(true);

    // Load high score from localStorage
    useEffect(() => {
        const savedHighScore = localStorage.getItem("spaceShooterHighScore");
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore));
        }
    }, []);

    // Save high score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("spaceShooterHighScore", score.toString());
        }
    }, [score, highScore]);

    // Spawn asteroids and stars
    useEffect(() => {
        if (!isPlaying || isPaused || gameOver) return;

        const asteroidInterval = setInterval(() => {
            const newAsteroid = {
                id: Date.now() + Math.random(),
                position: [
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 4,
                    -20,
                ] as [number, number, number],
                speed: 0.1 + Math.random() * 0.1,
            };
            setAsteroids((prev) => [...prev, newAsteroid]);
        }, 1500);

        const starInterval = setInterval(() => {
            const newStar = {
                id: Date.now() + Math.random(),
                position: [
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 4,
                    -20,
                ] as [number, number, number],
                speed: 0.15,
            };
            setStars((prev) => [...prev, newStar]);
        }, 2000);

        return () => {
            clearInterval(asteroidInterval);
            clearInterval(starInterval);
        };
    }, [isPlaying, isPaused, gameOver]);

    // Keyboard controls
    useEffect(() => {
        if (!isPlaying || isPaused || gameOver) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const speed = 0.5;
            setShipPosition((prev) => {
                let [x, y, z] = prev;
                if (e.key === "ArrowLeft" || e.key === "a") x = Math.max(x - speed, -4);
                if (e.key === "ArrowRight" || e.key === "d") x = Math.min(x + speed, 4);
                if (e.key === "ArrowUp" || e.key === "w") y = Math.min(y + speed, 2);
                if (e.key === "ArrowDown" || e.key === "s") y = Math.max(y - speed, -2);
                return [x, y, z];
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPlaying, isPaused, gameOver]);

    // Mouse/Touch controls
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPlaying || isPaused || gameOver) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        setShipPosition([x * 4, y * 2, 3]);
    };

    const handleAsteroidCollision = (hit: boolean) => {
        if (hit) {
            setLives((prev) => {
                const newLives = prev - 1;
                if (newLives <= 0) {
                    setGameOver(true);
                    setIsPlaying(false);
                }
                return newLives;
            });
        }
    };

    const handleStarCollect = () => {
        setScore((prev) => prev + 10);
    };

    const startGame = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setGameOver(false);
        setScore(0);
        setLives(3);
        setShipPosition([0, 0, 3]);
        setAsteroids([]);
        setStars([]);
        setShowInstructions(false);
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const resetGame = () => {
        startGame();
    };

    return (
        <section
            id="game"
            className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <Gamepad2 size={40} className="text-blue-500" />
                        <h2 className="text-5xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Space Shooter
                        </h2>
                    </motion.div>
                    <p
                        className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        Take a break and play a quick game!
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Game Stats */}
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                        <div
                            className={`flex gap-4 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    } shadow-lg`}
                            >
                                <span className="text-sm opacity-70">Score: </span>
                                <span className="text-2xl font-bold text-blue-500">{score}</span>
                            </div>
                            <div
                                className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    } shadow-lg`}
                            >
                                <span className="text-sm opacity-70">Lives: </span>
                                <span className="text-2xl font-bold text-red-500">{lives}</span>
                            </div>
                            <div
                                className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
                                    } shadow-lg flex items-center gap-2`}
                            >
                                <Trophy size={20} className="text-yellow-500" />
                                <span className="text-sm opacity-70">Best: </span>
                                <span className="text-xl font-bold text-yellow-500">
                                    {highScore}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {isPlaying && !gameOver && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={togglePause}
                                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${isDarkMode
                                        ? "bg-gray-800 text-white hover:bg-gray-700"
                                        : "bg-white text-gray-900 hover:bg-gray-100"
                                        } shadow-lg`}
                                >
                                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                                    {isPaused ? "Resume" : "Pause"}
                                </motion.button>
                            )}
                            {!isPlaying && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startGame}
                                    className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                >
                                    <Play size={20} />
                                    {gameOver ? "Play Again" : "Start Game"}
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Game Canvas */}
                    <div
                        className={`relative rounded-xl overflow-hidden shadow-2xl ${isDarkMode ? "bg-gray-900" : "bg-gray-800"
                            }`}
                        style={{ height: "500px" }}
                        onClick={handleCanvasClick}
                    >
                        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                            <Suspense fallback={null}>
                                <GameScene
                                    shipPosition={shipPosition}
                                    asteroids={asteroids}
                                    stars={stars}
                                    onAsteroidCollision={handleAsteroidCollision}
                                    onStarCollect={handleStarCollect}
                                />
                            </Suspense>
                        </Canvas>

                        {/* Overlays */}
                        <AnimatePresence>
                            {showInstructions && !isPlaying && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
                                >
                                    <div className="text-center text-white p-8 max-w-md">
                                        <h3 className="text-3xl font-bold mb-6">How to Play</h3>
                                        <div className="space-y-4 text-left">
                                            <p className="flex items-start gap-3">
                                                <span className="text-2xl">🎮</span>
                                                <span>
                                                    Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to
                                                    move your spaceship
                                                </span>
                                            </p>
                                            <p className="flex items-start gap-3">
                                                <span className="text-2xl">🖱️</span>
                                                <span>
                                                    Or <strong>Click/Tap</strong> anywhere to move there
                                                </span>
                                            </p>
                                            <p className="flex items-start gap-3">
                                                <span className="text-2xl">⭐</span>
                                                <span>
                                                    Collect <strong>Gold Stars</strong> for points (+10)
                                                </span>
                                            </p>
                                            <p className="flex items-start gap-3">
                                                <span className="text-2xl">💥</span>
                                                <span>
                                                    Avoid <strong>Red Asteroids</strong> or lose a life
                                                </span>
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowInstructions(false)}
                                            className="mt-8 px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg"
                                        >
                                            Got it!
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {isPaused && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
                                >
                                    <div className="text-center text-white">
                                        <Pause size={64} className="mx-auto mb-4" />
                                        <h3 className="text-4xl font-bold">Paused</h3>
                                    </div>
                                </motion.div>
                            )}

                            {gameOver && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/90 flex items-center justify-center z-10"
                                >
                                    <div className="text-center text-white p-8">
                                        <h3 className="text-5xl font-bold mb-4">Game Over!</h3>
                                        <p className="text-2xl mb-2">
                                            Final Score:{" "}
                                            <span className="text-blue-400 font-bold">{score}</span>
                                        </p>
                                        {score === highScore && score > 0 && (
                                            <p className="text-yellow-400 text-xl mb-6 flex items-center justify-center gap-2">
                                                <Trophy size={24} />
                                                New High Score!
                                            </p>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={resetGame}
                                            className="px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg flex items-center gap-2 mx-auto"
                                        >
                                            <RotateCcw size={20} />
                                            Play Again
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls Info */}
                    <div
                        className={`mt-4 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                    >
                        <p>
                            Controls: Arrow Keys / WASD / Click to Move • Collect ⭐ Stars •
                            Avoid 💥 Asteroids
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
