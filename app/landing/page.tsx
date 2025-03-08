"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/app/components/ui/aurora-background";
import { MovingBorder } from "@/app/components/ui/moving-border";
import Link from "next/link";
import { ArrowRight, Mic, Calendar, Book } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <AuroraBackground showRadialGradient={!hovered}>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-8 items-center justify-center px-6 max-w-4xl mx-auto text-center"
      >
        <motion.h1 
          className="text-4xl md:text-7xl font-bold dark:text-white"
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          Voice Journaling
        </motion.h1>
        <motion.div 
          className="text-lg md:text-2xl font-light dark:text-neutral-200 max-w-2xl flex flex-col gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p>Speak your thoughts into lasting memories.</p>
          <p>Your voice, your journey, your story — preserved forever.</p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <Link href="/setup" className="block">
            <MovingBorder
              borderRadius="9999px"
              className="px-8 py-4 font-medium text-white dark:text-white"
              containerClassName="w-full"
              duration={3000}
              colors={["#4f46e5", "#8b5cf6", "#a855f7", "#3b82f6"]}
              as="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <span className="flex items-center gap-2 text-base md:text-lg">
                Begin Your Journey <ArrowRight size={18} />
              </span>
            </MovingBorder>
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.div 
            whileHover={{ y: -5, scale: 1.03 }}
            className="flex flex-col items-center p-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl border border-white/20"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <Mic size={32} className="mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Effortless Capture</h3>
            <p className="text-sm text-center opacity-80">Speak freely and watch your thoughts transform into beautifully preserved memories</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.03 }}
            className="flex flex-col items-center p-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl border border-white/20"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <Calendar size={32} className="mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Journey Through Time</h3>
            <p className="text-sm text-center opacity-80">Revisit your past self and witness your growth through an intuitive timeline</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.03 }}
            className="flex flex-col items-center p-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl border border-white/20"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            <Book size={32} className="mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">Deeper Reflection</h3>
            <p className="text-sm text-center opacity-80">Uncover patterns and insights as you build a living archive of your authentic self</p>
          </motion.div>
        </motion.div>
        
        <motion.p
          className="text-sm md:text-base text-center max-w-lg mt-8 text-neutral-600 dark:text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          "The voice carries emotion that written words often miss."
        </motion.p>
      </motion.div>
    </AuroraBackground>
  );
} 