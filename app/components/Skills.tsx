"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useRef, useEffect } from "react";
import CompetitiveProgramming from "./CompetitiveProgramming";

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
        staggerChildren: 0.1,
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

  // Interactive Skill Bar Component
  const SkillBar = ({ skill, index }: { skill: any; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const barRef = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.05);
      y.set((e.clientY - centerY) * 0.05);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      setIsHovered(false);
    };

    return (
      <motion.div
        ref={barRef}
        className="group relative"
        style={{ x: xSpring, y: ySpring }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onHoverStart={() => {
          setIsHovered(true);
          setActiveSkill(skill.name);
        }}
        onHoverEnd={() => setActiveSkill(null)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Skill info */}
        <div className="flex justify-between items-center mb-3">
          <motion.span
            className="text-white/80 font-medium text-lg"
            animate={{ color: isHovered ? "#ffffff" : "rgba(255,255,255,0.8)" }}
          >
            {skill.name}
          </motion.span>
          <motion.span
            className="text-white/60 font-mono"
            animate={{
              scale: isHovered ? 1.1 : 1,
              color: isHovered ? "#3b82f6" : "rgba(255,255,255,0.6)",
            }}
          >
            {skill.level}%
          </motion.span>
        </div>

        {/* Skill bar container */}
        <div className="relative w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          {/* Background glow */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${skill.color} opacity-20`}
            animate={{ opacity: isHovered ? 0.4 : 0.2 }}
            transition={{ duration: 0.3 }}
          />

          {/* Progress bar */}
          <motion.div
            className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative overflow-hidden`}
            initial={false}
            animate={{ width: inView ? `${skill.level}%` : "0%" }}
            transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              animate={{
                x: isHovered ? ["0%", "100%"] : "0%",
                opacity: isHovered ? [0, 1, 0] : 0,
              }}
              transition={{
                duration: 0.8,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 1,
              }}
            />
          </motion.div>

          {/* Floating particles */}
          {isHovered &&
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "50%",
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
        </div>

        {/* Skill level indicator */}
        <motion.div
          className="absolute -top-8 bg-black/80 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm"
          style={{ left: `${skill.level}%` }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          {skill.level}%
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80" />
        </motion.div>
      </motion.div>
    );
  };

  // Tech Category Card Component
  const TechCard = ({ category, index }: { category: any; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    return (
      <motion.div
        ref={cardRef}
        className="glass-effect p-6 rounded-xl hover-lift relative overflow-hidden"
        initial={false}
        variants={itemVariants}
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          rotateX: 5,
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.h4
          className="text-lg font-semibold text-white mb-4 relative z-10"
          initial={false}
          animate={{
            y: isHovered ? -2 : 0,
            color: isHovered ? "#3b82f6" : "#ffffff",
          }}
        >
          {category.title}
        </motion.h4>

        <div className="space-y-2 relative z-10">
          {category.technologies.map((tech: string, techIndex: number) => (
            <motion.div
              key={tech}
              className="text-white/70 text-sm bg-white/5 px-3 py-2 rounded-full inline-block mr-2 mb-2 border border-white/10"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(59, 130, 246, 0.4)",
              }}
            >
              {tech}
            </motion.div>
          ))}
        </div>

        {/* Floating tech icons */}
        {isHovered &&
          [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/50 rounded-full"
              initial={false}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
      </motion.div>
    );
  };

  const skills = [
    { name: "React/Next.js", level: 95, color: "from-blue-500 to-cyan-500" },
    { name: "TypeScript", level: 90, color: "from-blue-600 to-blue-400" },
    { name: "Node.js", level: 85, color: "from-green-500 to-green-300" },
    { name: "Python", level: 80, color: "from-yellow-500 to-yellow-300" },
    { name: "AWS/Cloud", level: 75, color: "from-orange-500 to-orange-300" },
    { name: "UI/UX Design", level: 85, color: "from-purple-500 to-pink-500" },
    {
      name: "Database Design",
      level: 80,
      color: "from-indigo-500 to-purple-500",
    },
    { name: "DevOps", level: 70, color: "from-red-500 to-pink-500" },
  ];

  const categories = [
    {
      title: "Frontend",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
      ],
    },
    {
      title: "Backend",
      technologies: ["Node.js", "Express", "Python", "FastAPI", "GraphQL"],
    },
    {
      title: "Database",
      technologies: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Supabase"],
    },
    {
      title: "Tools & Others",
      technologies: ["Git", "Docker", "AWS", "Vercel", "Figma"],
    },
  ];

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              x: useTransform(
                mouseX,
                (x) =>
                  (x -
                    (typeof window !== "undefined" ? window.innerWidth : 1920) /
                      2) *
                  0.01
              ),
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="container-max relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              whileInView={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              My <span className="text-gradient">Skills</span>
            </motion.h2>
            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              I'm constantly learning and improving my skills. Here's what I
              work with:
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Enhanced Skill Bars */}
            <motion.div variants={itemVariants}>
              <motion.h3
                className="text-2xl font-bold text-white mb-8 flex items-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                💪 Proficiency
                {activeSkill && (
                  <motion.span
                    className="ml-4 text-lg text-blue-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    → {activeSkill}
                  </motion.span>
                )}
              </motion.h3>

              <div className="space-y-8">
                {skills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Enhanced Technology Categories */}
            <motion.div variants={itemVariants}>
              <motion.h3
                className="text-2xl font-bold text-white mb-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                🚀 Technologies
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                  <TechCard
                    key={category.title}
                    category={category}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Competitive Programming Section */}
          <CompetitiveProgramming />

          {/* Skills summary */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <motion.div
              className="inline-block px-8 py-4 glass-effect rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <motion.p
                className="text-white/80"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Always learning, always growing 🌱
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
