"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ExternalLink,
  Github,
  Eye,
  Star,
  Users,
  GitBranch,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

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

  // Enhanced 3D Card Component
  const ProjectCard = ({ project, index, size = "large" }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const springConfig = {
      stiffness: 150,
      damping: 15,
      mass: 1,
    };

    const xSpring = useSpring(mouseX, springConfig);
    const ySpring = useSpring(mouseY, springConfig);
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);
    const baseRotateY = useMotionValue(0);

    useEffect(() => {
      baseRotateY.set(isFlipped ? 180 : 0);
    }, [isFlipped, baseRotateY]);

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!cardRef.current || isFlipped) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * 0.05);
      mouseY.set((e.clientY - centerY) * 0.05);
    };

    const handleMouseLeave = () => {
      if (isFlipped) return;
      mouseX.set(0);
      mouseY.set(0);
    };

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
      mouseX.set(0);
      mouseY.set(0);
    };

    const cardClass = size === "large" ? "h-80" : "h-64";

    return (
      <motion.div
        ref={cardRef}
        className={`relative ${cardClass} perspective-1000 group`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onHoverStart={() => !isFlipped && setHoveredProject(project.title)}
        onHoverEnd={() => !isFlipped && setHoveredProject(null)}
        variants={itemVariants}
        initial={false}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d cursor-pointer"
          initial={false}
          style={{
            rotateX: rotateXSpring,
            rotateY: baseRotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden glass-effect rounded-xl overflow-hidden"
            initial={false}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative h-full">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-2/3 object-cover"
                initial={false}
                whileHover={{ scale: 1.1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1], // Custom spring-like curve
                }}
              />

              {/* Overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                initial={false}
                animate={{ opacity: hoveredProject === project.title ? 1 : 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />

              {/* Floating action buttons */}
              <motion.div
                className="absolute top-4 right-4 flex space-x-2"
                initial={false}
                animate={{
                  opacity: hoveredProject === project.title ? 1 : 0,
                  y: hoveredProject === project.title ? 0 : -20,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  initial={false}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github size={16} className="text-white" />
                </motion.a>
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  initial={false}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink size={16} className="text-white" />
                </motion.a>
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <motion.h4
                  className="text-xl font-semibold text-white mb-2"
                  initial={false}
                >
                  {project.title}
                </motion.h4>

                <motion.p
                  className="text-white/70 mb-4 line-clamp-2"
                  initial={false}
                >
                  {project.description}
                </motion.p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies
                    .slice(0, 3)
                    .map((tech: string, techIndex: number) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm backdrop-blur-sm"
                        initial={false}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(255,255,255,0.2)",
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  {project.technologies.length > 3 && (
                    <span className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden glass-effect rounded-xl p-6 flex flex-col justify-between"
            initial={false}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex flex-col h-full">
              <h4 className="text-xl font-semibold text-white mb-3">
                {project.title}
              </h4>
              <p className="text-white/70 mb-4 text-sm">
                {project.description}
              </p>

              {/* All technologies */}
              <div className="mb-4">
                <p className="text-white/80 text-sm mb-2">Technologies:</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white/10 text-white/70 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons in a row */}
              <div className="mt-auto flex gap-3">
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-center text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Live Demo
                </motion.a>
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 border border-white/30 text-white rounded-lg font-medium text-center hover:bg-white/10 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Source Code
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10"
          initial={false}
          animate={{
            opacity: hoveredProject === project.title ? 1 : 0,
            scale: hoveredProject === project.title ? 1.1 : 0.8,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    );
  };

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with Next.js, Stripe payments, and admin dashboard. Features real-time inventory management and analytics.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      technologies: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true,
    },
    {
      title: "Task Management App",
      description:
        "A collaborative project management tool with real-time updates and team collaboration. Built with modern tech stack for scalability.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "JWT"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: true,
    },
    {
      title: "Weather Dashboard",
      description:
        "A beautiful weather application with location-based forecasts and interactive maps.",
      image:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80",
      technologies: ["React", "OpenWeather API", "Mapbox", "Chart.js"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false,
    },
    {
      title: "AI Chat Bot",
      description:
        "An intelligent chatbot powered by OpenAI GPT with custom training data.",
      image:
        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
      technologies: ["Python", "OpenAI API", "FastAPI", "React", "WebSocket"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false,
    },
    {
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio website with animations and dark mode.",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false,
    },
    {
      title: "Social Media Analytics",
      description:
        "A comprehensive analytics dashboard for social media performance tracking.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      technologies: ["Vue.js", "D3.js", "Python", "Django", "PostgreSQL"],
      github: "https://github.com",
      demo: "https://demo.com",
      featured: false,
    },
  ];

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="section-padding bg-black/20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
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
              transition={{ duration: 3, repeat: Infinity }}
            >
              My <span className="text-gradient">Projects</span>
            </motion.h2>
            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Here are some of my recent projects that showcase my skills and
              passion for development. Click on cards to see more details!
            </motion.p>
          </motion.div>

          {/* Featured Projects */}
          <motion.div variants={itemVariants} className="mb-16">
            <motion.h3
              className="text-2xl font-bold text-white mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              ⭐ Featured Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  size="large"
                />
              ))}
            </div>
          </motion.div>

          {/* Other Projects */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="text-2xl font-bold text-white mb-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              🚀 Other Projects
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  size="small"
                />
              ))}
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div className="text-center mt-16" variants={itemVariants}>
            <motion.p
              className="text-white/60 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Interested in working together?
            </motion.p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Let's Create Something Amazing
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
