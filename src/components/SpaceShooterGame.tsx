"use client";

import React, { useRef, useState, useEffect } from "react";
import useStore from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Trophy, RotateCcw, Play, Pause } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { colorScheme } from "@/utils/colorUtils";

interface GameObject {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

// Main Game Component
export default function SpaceShooterGame() {
  const { isDarkMode } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [touchControls, setTouchControls] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // Game state refs
  const shipRef = useRef({ x: 400, y: 450, width: 40, height: 40 });
  const asteroidsRef = useRef<GameObject[]>([]);
  const starsRef = useRef<GameObject[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const lastShotRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const touchControlsRef = useRef(touchControls);

  // Update touchControlsRef when touchControls changes
  useEffect(() => {
    touchControlsRef.current = touchControls;
  }, [touchControls]);

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

  // Draw spaceship
  const drawShip = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);

    // Main body (triangle)
    ctx.fillStyle = "#4299e1";
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 20);
    ctx.lineTo(15, 20);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = "#f6ad55";
    ctx.beginPath();
    ctx.arc(0, -5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = "#667eea";
    ctx.fillRect(-20, 5, 8, 15);
    ctx.fillRect(12, 5, 8, 15);

    ctx.restore();
  };

  // Draw asteroid
  const drawAsteroid = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    ctx.fillStyle = "#e53e3e";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 15 + Math.random() * 5;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  };

  // Draw star
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#ffd700";
    ctx.strokeStyle = "#ffa500";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const outerRadius = 12;
      const innerRadius = 6;
      const outerX = x + Math.cos(angle) * outerRadius;
      const outerY = y + Math.sin(angle) * outerRadius;
      const innerAngle = angle + Math.PI / 5;
      const innerX = x + Math.cos(innerAngle) * innerRadius;
      const innerY = y + Math.sin(innerAngle) * innerRadius;
      if (i === 0) ctx.moveTo(outerX, outerY);
      else ctx.lineTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Draw bullet
  const drawBullet = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(x - 2, y, 4, 10);
  };

  // Draw particle
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  // Create explosion particles
  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color,
      });
    }
  };

  // Check collision
  const checkCollision = (
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ) => {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  };

  // Game loop
  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying || isPaused || gameOver) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 73 + Date.now() * 0.05) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }

    // Update ship position
    const ship = shipRef.current;
    if (
      keysRef.current["ArrowLeft"] ||
      keysRef.current["a"] ||
      touchControlsRef.current.left
    )
      ship.x = Math.max(20, ship.x - 5);
    if (
      keysRef.current["ArrowRight"] ||
      keysRef.current["d"] ||
      touchControlsRef.current.right
    )
      ship.x = Math.min(canvas.width - 20, ship.x + 5);
    if (
      keysRef.current["ArrowUp"] ||
      keysRef.current["w"] ||
      touchControlsRef.current.up
    )
      ship.y = Math.max(20, ship.y - 5);
    if (
      keysRef.current["ArrowDown"] ||
      keysRef.current["s"] ||
      touchControlsRef.current.down
    )
      ship.y = Math.min(canvas.height - 20, ship.y + 5);

    // Auto-shoot
    const now = Date.now();
    if (now - lastShotRef.current > 200) {
      bulletsRef.current.push({ id: now, x: ship.x, y: ship.y - 20 });
      lastShotRef.current = now;
    }

    // Update and draw bullets
    bulletsRef.current = bulletsRef.current.filter((bullet) => {
      bullet.y -= 8;
      if (bullet.y < 0) return false;
      drawBullet(ctx, bullet.x, bullet.y);
      return true;
    });

    // Update and draw asteroids
    asteroidsRef.current = asteroidsRef.current.filter((asteroid) => {
      asteroid.y += asteroid.speed;
      if (asteroid.y > canvas.height) return false;

      // Check bullet collision
      let hit = false;
      bulletsRef.current = bulletsRef.current.filter((bullet) => {
        if (
          checkCollision(
            bullet.x - 2,
            bullet.y,
            4,
            10,
            asteroid.x - 15,
            asteroid.y - 15,
            30,
            30
          )
        ) {
          hit = true;
          createExplosion(asteroid.x, asteroid.y, "#e53e3e");
          setScore((prev) => prev + 5);
          return false;
        }
        return true;
      });

      if (hit) return false;

      // Check ship collision
      if (
        checkCollision(
          ship.x - 15,
          ship.y - 20,
          30,
          40,
          asteroid.x - 15,
          asteroid.y - 15,
          30,
          30
        )
      ) {
        createExplosion(asteroid.x, asteroid.y, "#e53e3e");
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
            setIsPlaying(false);
          }
          return newLives;
        });
        return false;
      }

      drawAsteroid(ctx, asteroid.x, asteroid.y);
      return true;
    });

    // Update and draw stars
    starsRef.current = starsRef.current.filter((star) => {
      star.y += star.speed;
      if (star.y > canvas.height) return false;

      // Check ship collision
      if (
        checkCollision(
          ship.x - 15,
          ship.y - 20,
          30,
          40,
          star.x - 12,
          star.y - 12,
          24,
          24
        )
      ) {
        createExplosion(star.x, star.y, "#ffd700");
        setScore((prev) => prev + 10);
        return false;
      }

      drawStar(ctx, star.x, star.y);
      return true;
    });

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      if (particle.life <= 0) return false;
      drawParticle(ctx, particle);
      return true;
    });

    // Draw ship
    drawShip(ctx, ship.x, ship.y);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  // Spawn enemies
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const asteroidInterval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      asteroidsRef.current.push({
        id: Date.now(),
        x: Math.random() * (canvas.width - 40) + 20,
        y: -20,
        speed: 2 + Math.random() * 2,
      });
    }, 1000);

    const starInterval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      starsRef.current.push({
        id: Date.now(),
        x: Math.random() * (canvas.width - 40) + 20,
        y: -20,
        speed: 3,
      });
    }, 2000);

    return () => {
      clearInterval(asteroidInterval);
      clearInterval(starInterval);
    };
  }, [isPlaying, isPaused, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Touch control handlers
  const handleTouchStart = (direction: string) => {
    setTouchControls((prev) => ({ ...prev, [direction]: true }));
  };

  const handleTouchEnd = (direction: string) => {
    setTouchControls((prev) => ({ ...prev, [direction]: false }));
  };

  // Start game loop
  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isPaused, gameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    shipRef.current = { x: 400, y: 450, width: 40, height: 40 };
    asteroidsRef.current = [];
    starsRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    setShowInstructions(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    startGame();
  };

  return (
    <AnimatedSection animation="fadeIn">
      <section
        id="game"
        className={`py-20 ${colorScheme.background.secondary}`}
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
                  <span className="text-2xl font-bold text-blue-500">
                    {score}
                  </span>
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
            >
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full h-auto"
                style={{ display: "block" }}
              />

              {/* Idle State - Cool Background */}
              {!isPlaying && !showInstructions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  }}
                >
                  <div className="text-center text-white relative z-10">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Gamepad2 size={80} className="mx-auto mb-6" />
                    </motion.div>
                    <motion.h3
                      className="text-5xl font-bold mb-4"
                      animate={{
                        textShadow: [
                          "0 0 20px rgba(255,255,255,0.5)",
                          "0 0 40px rgba(255,255,255,0.8)",
                          "0 0 20px rgba(255,255,255,0.5)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      SPACE SHOOTER
                    </motion.h3>
                    <motion.p
                      className="text-xl opacity-90"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Press Start to Begin
                    </motion.p>
                    <div className="mt-6 flex gap-4 justify-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span>Collect Stars</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💥</span>
                        <span>Shoot Asteroids</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        <span>Beat High Score</span>
                      </div>
                    </div>
                  </div>
                  {/* Animated stars in background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

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
                            Use <strong>Arrow Keys</strong> or{" "}
                            <strong>WASD</strong> (Desktop) or{" "}
                            <strong>D-Pad</strong> (Mobile) to move your spaceship
                          </span>
                        </p>
                        <p className="flex items-start gap-3">
                          <span className="text-2xl">�️</span>
                          <span>
                            Your ship <strong>auto-shoots</strong> bullets
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
                            Shoot <strong>Red Asteroids</strong> for +5 points
                          </span>
                        </p>
                        <p className="flex items-start gap-3">
                          <span className="text-2xl">💀</span>
                          <span>Hitting asteroids loses a life!</span>
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

            {/* Mobile Touch Controls */}
            <div className="md:hidden mt-6">
              <div className="flex justify-center items-center gap-4">
                {/* D-Pad */}
                <div className="relative w-32 h-32">
                  {/* Up */}
                  <button
                    onTouchStart={() => handleTouchStart("up")}
                    onTouchEnd={() => handleTouchEnd("up")}
                    onMouseDown={() => handleTouchStart("up")}
                    onMouseUp={() => handleTouchEnd("up")}
                    className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-lg ${touchControls.up
                      ? "bg-blue-500"
                      : isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                      } 
                    ${isDarkMode ? "text-white" : "text-gray-900"
                      } flex items-center justify-center`}
                  >
                    ▲
                  </button>
                  {/* Down */}
                  <button
                    onTouchStart={() => handleTouchStart("down")}
                    onTouchEnd={() => handleTouchEnd("down")}
                    onMouseDown={() => handleTouchStart("down")}
                    onMouseUp={() => handleTouchEnd("down")}
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-lg ${touchControls.down
                      ? "bg-blue-500"
                      : isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                      } 
                    ${isDarkMode ? "text-white" : "text-gray-900"
                      } flex items-center justify-center`}
                  >
                    ▼
                  </button>
                  {/* Left */}
                  <button
                    onTouchStart={() => handleTouchStart("left")}
                    onTouchEnd={() => handleTouchEnd("left")}
                    onMouseDown={() => handleTouchStart("left")}
                    onMouseUp={() => handleTouchEnd("left")}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-lg ${touchControls.left
                      ? "bg-blue-500"
                      : isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                      } 
                    ${isDarkMode ? "text-white" : "text-gray-900"
                      } flex items-center justify-center`}
                  >
                    ◄
                  </button>
                  {/* Right */}
                  <button
                    onTouchStart={() => handleTouchStart("right")}
                    onTouchEnd={() => handleTouchEnd("right")}
                    onMouseDown={() => handleTouchStart("right")}
                    onMouseUp={() => handleTouchEnd("right")}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-lg ${touchControls.right
                      ? "bg-blue-500"
                      : isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-300"
                      } 
                    ${isDarkMode ? "text-white" : "text-gray-900"
                      } flex items-center justify-center`}
                  >
                    ►
                  </button>
                  {/* Center */}
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-gray-400"
                      }`}
                  ></div>
                </div>
              </div>
              <p
                className={`text-center text-xs mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Use the D-Pad to move your spaceship
              </p>
            </div>

            {/* Controls Info */}
            <div
              className={`mt-4 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              <p>
                Controls: Arrow Keys / WASD to Move • Auto-Shoot 🔫 • Collect ⭐
                Stars (+10) • Shoot 💥 Asteroids (+5)
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
