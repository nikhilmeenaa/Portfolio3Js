"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code, Palette, Zap, Heart, Briefcase, Calendar } from "lucide-react";

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const experiences = [
    {
      title: "Full Stack Developer",
      company: "Finarb",
      duration: "2024 - Present",
      description:
        "Leading frontend development of enterprise applications using Next.js and TypeScript. Implemented microservices architecture and improved system performance by 40%.",
      tags: [
        "Next.js",
        "React.js",
        "FastAPI",
        "Django",
        "TypeScript",
        "AWS",
        "Microservices",
      ],
    },
    {
      title: "Software Engineer",
      company: "Autotext",
      duration: "2023 - 2024",
      description:
        "Developed and maintained multiple full-stack applications. Led a team of 4 developers and introduced modern development practices.",
      tags: ["React", "Node.js", "MongoDB", "Docker"],
    },
    {
      title: "Software Developer",
      company: "Creatosaurus",
      duration: "2022 - 2023",
      description:
        "Built responsive web applications and contributed to core product development. Implemented real-time features using WebSocket.",
      tags: ["JavaScript", "Python", "PostgreSQL", "WebSocket"],
    },
  ];

  const features = [
    {
      icon: <Code size={32} />,
      title: "Clean Code",
      description:
        "Writing maintainable, scalable code following best practices",
    },
    {
      icon: <Palette size={32} />,
      title: "Design Focus",
      description:
        "Creating beautiful, intuitive user interfaces and experiences",
    },
    {
      icon: <Zap size={32} />,
      title: "Performance",
      description: "Optimizing applications for speed and efficiency",
    },
    {
      icon: <Heart size={32} />,
      title: "Passion",
      description: "Loving what I do and constantly learning new technologies",
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center section-padding"
    >
      <div className="container-max">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-16"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
            <p className="text-white/60 max-w-2xl">
              Passionate about creating elegant solutions to complex problems.
              With a strong foundation in competitive programming and software
              development, I bring both algorithmic excellence and practical
              implementation skills to every project.
            </p>
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Briefcase className="mr-2" /> Experience
            </h3>
            <div className="relative space-y-8">
              {/* Timeline line */}
              <div className="absolute left-8 top-5 bottom-5 w-px bg-white/20" />

              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  className="relative grid grid-cols-[80px_1fr] gap-6 md:gap-8"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {/* Timeline dot */}
                  <div className="relative">
                    <div className="absolute left-7 top-5 w-3 h-3 rounded-full bg-blue-500 shadow-glow-md z-10" />
                    <Calendar className="text-white/60" />
                  </div>

                  {/* Content card */}
                  <div className="glass-effect p-6 rounded-xl hover-lift">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xl font-semibold text-white">
                          {exp.title}
                        </h4>
                        <p className="text-blue-400">{exp.company}</p>
                      </div>
                      <span className="text-white/60 text-sm">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-white/70 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-8">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="glass-effect p-6 rounded-lg hover-lift"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
