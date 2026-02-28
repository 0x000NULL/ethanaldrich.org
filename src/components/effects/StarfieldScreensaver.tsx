"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
}

interface StarfieldScreensaverProps {
  onDismiss: () => void;
}

const STAR_COUNT = 200;
const SPEED = 15;
const MAX_DEPTH = 1000;

export default function StarfieldScreensaver({ onDismiss }: StarfieldScreensaverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  // Initialize stars
  const initStars = useCallback((width: number, height: number): Star[] => {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * MAX_DEPTH,
      });
    }
    return stars;
  }, []);

  // Reset a star when it goes off screen
  const resetStar = useCallback((star: Star, width: number, height: number) => {
    star.x = Math.random() * width - width / 2;
    star.y = Math.random() * height - height / 2;
    star.z = MAX_DEPTH;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      // Clear with black background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update stars
      starsRef.current.forEach((star) => {
        // Move star toward viewer
        star.z -= SPEED;

        // Reset star if it's too close
        if (star.z <= 0) {
          resetStar(star, canvas.width, canvas.height);
        }

        // Project 3D to 2D
        const factor = 128 / star.z;
        const sx = star.x * factor + centerX;
        const sy = star.y * factor + centerY;

        // Check if star is on screen
        if (sx < 0 || sx >= canvas.width || sy < 0 || sy >= canvas.height) {
          resetStar(star, canvas.width, canvas.height);
          return;
        }

        // Calculate size and brightness based on depth
        const size = Math.max(0.5, (1 - star.z / MAX_DEPTH) * 3);
        const brightness = 1 - star.z / MAX_DEPTH;

        // Draw star
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw motion trail for fast stars
        if (star.z < MAX_DEPTH / 2) {
          const trailFactor = 128 / (star.z + SPEED * 2);
          const trailX = star.x * trailFactor + centerX;
          const trailY = star.y * trailFactor + centerY;

          ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.3})`;
          ctx.lineWidth = size * 0.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(trailX, trailY);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initStars, resetStar]);

  // Handle dismiss on any interaction
  useEffect(() => {
    const handleDismiss = () => onDismiss();

    window.addEventListener("keydown", handleDismiss);
    window.addEventListener("mousedown", handleDismiss);
    window.addEventListener("mousemove", handleDismiss);
    window.addEventListener("touchstart", handleDismiss);

    return () => {
      window.removeEventListener("keydown", handleDismiss);
      window.removeEventListener("mousedown", handleDismiss);
      window.removeEventListener("mousemove", handleDismiss);
      window.removeEventListener("touchstart", handleDismiss);
    };
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-[9999] cursor-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
