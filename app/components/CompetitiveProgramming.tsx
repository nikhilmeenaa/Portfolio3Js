"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Star, Award, Timer } from "lucide-react";

const CompetitiveProgramming = () => {
  const achievements = [
    {
      platform: "CodeChef",
      logo: "/images/codechef-logo.svg",
      icon: <Star size={24} className="text-yellow-400" />,
      title: "5★ Coder",
      link: "https://www.codechef.com/users/nikhil_meena",
      className: "bg-gradient-to-r from-yellow-400/20 to-orange-500/20",
      iconBg: "bg-gradient-to-r from-yellow-400 to-orange-500",
      description:
        "Achieved 5-star rating with exceptional problem-solving skills",
    },
    {
      platform: "LeetCode",
      logo: "/images/leetcode-logo.svg",
      icon: <Award size={24} className="text-purple-400" />,
      title: "Knight",
      link: "https://leetcode.com/u/Nikhil_Meena/",
      className: "bg-gradient-to-r from-purple-400/20 to-pink-500/20",
      iconBg: "bg-gradient-to-r from-purple-400 to-pink-500",
      description: "Achieved Knight badge with consistent high performance",
    },
    {
      platform: "CodeForces",
      logo: "/images/codeforces-logo.svg",
      icon: <Trophy size={24} className="text-blue-400" />,
      title: "Expert",
      link: "https://codeforces.com/profile/nikhilkameena",
      className: "bg-gradient-to-r from-blue-400/20 to-cyan-500/20",
      iconBg: "bg-gradient-to-r from-blue-400 to-cyan-500",
      description:
        "Expert level competitive programmer with strong algorithmic skills",
    },
    {
      platform: "ICPC",
      logo: "/images/icpc-logo.svg",
      icon: <Timer size={24} className="text-green-400" />,
      title: "2x Regionalist",
      link: "#",
      className: "bg-gradient-to-r from-green-400/20 to-emerald-500/20",
      iconBg: "bg-gradient-to-r from-green-400 to-emerald-500",
      description:
        "Two-time ICPC regional finalist with team problem-solving excellence",
    },
  ];

  return (
    <div className="mt-16">
      <motion.h3
        className="text-2xl font-bold text-white mb-8 flex items-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        🏆 Competitive Programming
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => (
          <motion.a
            key={achievement.platform}
            href={achievement.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group p-6 rounded-lg ${achievement.className} hover:scale-105 transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${achievement.className}`}
            />
            <div className="relative z-10">
              {/* Platform Logo */}
              <div className="w-12 h-12 mb-4 relative">
                <Image
                  src={achievement.logo}
                  alt={`${achievement.platform} logo`}
                  fill
                  className="object-contain"
                />
              </div>

              <h4 className="text-white font-semibold text-lg mb-1">
                {achievement.platform}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full ${achievement.iconBg} flex items-center justify-center`}
                >
                  {achievement.icon}
                </div>
                <p className="text-white/90 font-medium">{achievement.title}</p>
              </div>
              <p className="text-white/70 text-sm">{achievement.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default CompetitiveProgramming;
