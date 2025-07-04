"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import ThreeBackground from "./ThreeBackground";

const ParallaxBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Multiple parallax layers with different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Smooth mouse tracking
  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Particle system
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speed: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div ref={ref} className="fixed inset-0 z-0 overflow-hidden">
      {/* Three.js background */}
      <ThreeBackground />

      {/* Overlay gradient */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none"
      />

      {/* Morphing shapes layer with reduced opacity */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 opacity-50 pointer-events-none"
      >
        {/* Large morphing blob */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          style={{
            left: "10%",
            top: "20%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Second morphing blob */}
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl"
          style={{
            right: "10%",
            bottom: "20%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            borderRadius: ["50%", "40%", "50%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Interactive particle system */}
      <motion.div style={{ y: y3 }} className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              x: useTransform(
                mouseXSpring,
                (x) => (x - window.innerWidth / 2) * particle.speed * 0.1
              ),
              y: useTransform(
                mouseYSpring,
                (y) => (y - window.innerHeight / 2) * particle.speed * 0.1
              ),
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Floating geometric shapes */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-white/10 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              borderRadius: ["0%", "50%", "0%"],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* Dynamic grid pattern with reduced opacity */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
          opacity: useTransform(
            scrollYProgress,
            [0, 0.5, 1],
            [0.05, 0.1, 0.05]
          ),
        }}
      />

      {/* Animated lines with reduced opacity */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              width: "100%",
              top: `${20 + i * 15}%`,
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParallaxBackground;
