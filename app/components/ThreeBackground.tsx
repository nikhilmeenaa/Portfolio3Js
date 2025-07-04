"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ThreeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    let THREE: any;
    let scene: any;
    let camera: any;
    let renderer: any;
    let stars: any;
    let particles: any;
    let raycaster: any;
    let mouse: any;
    let selectedPoint: any = null;
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let autoRotationX = 0;
    let autoRotationY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const init = async () => {
      try {
        THREE = await import("three");
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Custom star shader with enhanced brightness
        const starVertexShader = `
          attribute float size;
          attribute vec3 customColor;
          varying vec3 vColor;
          void main() {
            vColor = customColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (450.0 / -mvPosition.z); // Reduced from 600 to 450
            gl_Position = projectionMatrix * mvPosition;
          }
        `;

        const starFragmentShader = `
          varying vec3 vColor;
          void main() {
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float r = sqrt(xy.x * xy.x + xy.y * xy.y);
            if (r > 0.5) discard;
            float strength = 1.0 - (r / 0.5);
            strength = pow(strength, 1.5); // Reduced power for brighter core
            gl_FragColor = vec4(vColor, strength);
          }
        `;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;

        // Create stars with custom shader
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 3500; // Reduced from 4500
        const starsPositions = new Float32Array(starsCount * 3);
        const starsSizes = new Float32Array(starsCount);
        const starsColors = new Float32Array(starsCount * 3);

        const starColors = [
          new THREE.Color(0xffffff).multiplyScalar(1.1), // Slightly reduced brightness
          new THREE.Color(0xffffff).multiplyScalar(1.1),
          new THREE.Color(0xffddb4).multiplyScalar(1.05),
          new THREE.Color(0xb4c7ff).multiplyScalar(1.05),
          new THREE.Color(0xffe8b4).multiplyScalar(1.05),
        ];

        for (let i = 0; i < starsCount; i++) {
          const i3 = i * 3;
          const radius = Math.random() * 20;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          starsPositions[i3 + 2] = radius * Math.cos(phi);

          // Slightly reduced star sizes
          if (i < starsCount * 0.1) {
            // 10% very bright stars
            starsSizes[i] = Math.random() * 0.04 + 0.025;
          } else if (i < starsCount * 0.3) {
            // 20% medium bright stars
            starsSizes[i] = Math.random() * 0.025 + 0.015;
          } else {
            // 70% normal stars
            starsSizes[i] = Math.random() * 0.015 + 0.008;
          }

          const color =
            starColors[Math.floor(Math.random() * starColors.length)];
          starsColors[i3] = color.r;
          starsColors[i3 + 1] = color.g;
          starsColors[i3 + 2] = color.b;
        }

        starsGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(starsPositions, 3)
        );
        starsGeometry.setAttribute(
          "size",
          new THREE.BufferAttribute(starsSizes, 1)
        );
        starsGeometry.setAttribute(
          "customColor",
          new THREE.BufferAttribute(starsColors, 3)
        );

        const starsMaterial = new THREE.ShaderMaterial({
          uniforms: {},
          vertexShader: starVertexShader,
          fragmentShader: starFragmentShader,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
          opacity: 1.0, // Increased opacity
        });

        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200; // Increased from 100
        const particlesPositions = new Float32Array(particlesCount * 3);
        const particlesSizes = new Float32Array(particlesCount);
        const particlesColors = new Float32Array(particlesCount * 3);

        // Create layered particle distribution
        for (let i = 0; i < particlesCount; i++) {
          const i3 = i * 3;
          let radius;

          // Create layers of particles
          if (i < particlesCount * 0.4) {
            // Inner layer
            radius = Math.random() * 8 + 4;
          } else if (i < particlesCount * 0.8) {
            // Middle layer
            radius = Math.random() * 12 + 8;
          } else {
            // Outer layer
            radius = Math.random() * 15 + 12;
          }

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          particlesPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          particlesPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          particlesPositions[i3 + 2] = radius * Math.cos(phi);

          // Add some random displacement
          particlesPositions[i3] += (Math.random() - 0.5) * 3;
          particlesPositions[i3 + 1] += (Math.random() - 0.5) * 3;
          particlesPositions[i3 + 2] += (Math.random() - 0.5) * 3;

          // Varied particle sizes
          if (i < particlesCount * 0.2) {
            // 20% larger particles
            particlesSizes[i] = Math.random() * 0.15 + 0.1;
          } else if (i < particlesCount * 0.6) {
            // 40% medium particles
            particlesSizes[i] = Math.random() * 0.1 + 0.05;
          } else {
            // 40% smaller particles
            particlesSizes[i] = Math.random() * 0.05 + 0.02;
          }

          // Enhanced blue to cyan gradient with more variation
          const blueIntensity = 0.4 + Math.random() * 0.2;
          particlesColors[i3] = blueIntensity * 0.5; // R
          particlesColors[i3 + 1] = blueIntensity * 0.8 + Math.random() * 0.2; // G
          particlesColors[i3 + 2] = blueIntensity + 0.2; // B
        }

        particlesGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(particlesPositions, 3)
        );
        particlesGeometry.setAttribute(
          "size",
          new THREE.BufferAttribute(particlesSizes, 1)
        );
        particlesGeometry.setAttribute(
          "customColor",
          new THREE.BufferAttribute(particlesColors, 3)
        );

        const particlesMaterial = new THREE.ShaderMaterial({
          uniforms: {},
          vertexShader: starVertexShader,
          fragmentShader: starFragmentShader,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
        });

        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Event handlers
        const handleMouseMove = (event: MouseEvent) => {
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          mouseX = event.clientX;
          mouseY = event.clientY;

          if (isDragging) {
            const deltaX = (event.clientX - dragStartX) * 0.01;
            const deltaY = (event.clientY - dragStartY) * 0.01;

            velocityX = deltaX;
            velocityY = deltaY;

            targetRotationX += deltaY;
            targetRotationY += deltaX;

            dragStartX = event.clientX;
            dragStartY = event.clientY;
          }
        };

        const handleMouseDown = (event: MouseEvent) => {
          setIsDragging(true);
          dragStartX = event.clientX;
          dragStartY = event.clientY;
        };

        const handleMouseUp = () => {
          setIsDragging(false);
        };

        const handleWheel = (event: WheelEvent) => {
          camera.position.z = Math.max(
            2,
            Math.min(10, camera.position.z + event.deltaY * 0.001)
          );
        };

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("wheel", handleWheel);
        window.addEventListener("resize", handleResize);

        // Animation loop
        const animate = () => {
          // Auto rotation
          autoRotationX += 0.0003;
          autoRotationY += 0.0005;

          // Smooth rotation with inertia
          if (!isDragging) {
            velocityX *= 0.95;
            velocityY *= 0.95;
            targetRotationY += velocityX;
            targetRotationX += velocityY;
          }

          currentRotationX += (targetRotationX - currentRotationX) * 0.1;
          currentRotationY += (targetRotationY - currentRotationY) * 0.1;

          // Apply both auto rotation and user interaction
          stars.rotation.x = currentRotationX + autoRotationX;
          stars.rotation.y = currentRotationY + autoRotationY;

          particles.rotation.x = autoRotationX * 0.5;
          particles.rotation.y = autoRotationY * 0.5;

          // Animate particles
          const particlePositions =
            particles.geometry.attributes.position.array;
          for (let i = 0; i < particlePositions.length; i += 3) {
            particlePositions[i + 1] +=
              Math.sin(Date.now() * 0.001 + i) * 0.001;
          }
          particles.geometry.attributes.position.needsUpdate = true;

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mousedown", handleMouseDown);
          window.removeEventListener("mouseup", handleMouseUp);
          window.removeEventListener("wheel", handleWheel);
          window.removeEventListener("resize", handleResize);
          cancelAnimationFrame(animationFrameId);
          renderer.dispose();
        };
      } catch (error) {
        console.error("Error initializing Three.js:", error);
      }
    };

    const cleanup = init();
    return () => {
      cleanup.then((cleanupFn) => {
        if (cleanupFn) cleanupFn();
      });
    };
  }, [isClient, isDragging]);

  if (!isClient) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-blue-900/20 to-black">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at center, #000008 0%, #000000 100%)", // Slightly lighter background
          cursor: isDragging ? "grabbing" : "grab",
        }}
      />
    </>
  );
};

export default ThreeBackground;
