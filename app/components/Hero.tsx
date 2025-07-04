"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const texts = ["Full Stack Developer", "Problem Solver", "Creative Thinker"];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Typewriter effect
  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
          if (displayText === currentText) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayText(currentText.substring(0, displayText.length - 1));
          if (displayText === "") {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 150
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Magnetic component for interactive elements
  const MagneticElement = ({ children, className = "", ...props }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.1);
      y.set((e.clientY - centerY) * 0.1);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        style={{ x: xSpring, y: ySpring }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Sparkles />
          </motion.div>
        ))}
      </div>

      <div className="container-max section-padding text-center">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            {/* Animated greeting */}
            <motion.div
              className="text-lg md:text-xl text-white/60 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                👋
              </motion.span>{" "}
              Hello there, I'm
            </motion.div>

            {/* Name with letter animation */}
            <motion.h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {"Nikhil Meena".split("").map((char, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-gradient"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Typewriter effect title */}
            <motion.h2 className="text-2xl md:text-3xl text-white/80 mb-6 h-12 flex items-center justify-center">
              <span className="border-r-2 border-blue-500 pr-2 animate-pulse">
                {displayText}
              </span>
            </motion.h2>

            {/* Animated description */}
            <motion.p
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              I design and develop sleek, high-performance web and mobile apps
              using modern frontend and backend technologies. From pixel-perfect
              UI to scalable backend architecture, I bring ideas to life with
              clean code, seamless UX, and full-stack precision.
            </motion.p>
          </motion.div>

          {/* Magnetic social links */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-6 mb-12"
          >
            {[
              {
                icon: Github,
                href: "https://github.com/nikhilmeenaa",
                color: "hover:text-purple-400",
              },
              {
                icon: Linkedin,
                href: "https://www.linkedin.com/in/nikhil-meena-8152771a1/",
                color: "hover:text-blue-400",
              },
              {
                icon: Mail,
                href: "mailto:nikhilmeena809.com",
                color: "hover:text-green-400",
              },
            ].map(({ icon: Icon, href, color }, index) => (
              <MagneticElement key={index}>
                <motion.a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 group ${color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    size={24}
                    className="text-white group-hover:scale-110 transition-transform"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </MagneticElement>
            ))}
          </motion.div>

          {/* Animated buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-4 flex-wrap gap-4"
          >
            <MagneticElement>
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">View My Work</span>
              </motion.button>
            </MagneticElement>

            <MagneticElement>
              <motion.button
                className="group relative px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Get In Touch</span>
              </motion.button>
            </MagneticElement>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="scroll-indicator fixed left-0 right-0 bottom-8 mx-auto w-fit cursor-pointer transition-opacity duration-300"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.2 }}
        onClick={() =>
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <motion.div
          className="p-2 rounded-full border-2 border-white/20 bg-white/5"
          whileHover={{ borderColor: "rgba(255,255,255,0.4)" }}
        >
          <ChevronDown size={32} className="text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
