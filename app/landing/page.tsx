"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 py-12 min-h-screen"
      >
        <div className="text-3xl md:text-7xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          Voice Journaling
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="font-extralight text-base md:text-2xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            Speak your thoughts into lasting memories.
          </div>
          <div className="font-extralight text-base md:text-2xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            Your voice, your journey, your story — preserved forever.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-6xl">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl text-center"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Effortless Capture</h3>
            <p className="text-white/80">
              Record your thoughts naturally through voice, eliminating the friction of typing.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl text-center"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Journey Through Time</h3>
            <p className="text-white/80">
              Revisit past entries through an intuitive calendar view and track your growth.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl text-center"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Deeper Reflection</h3>
            <p className="text-white/80">
              Guided prompts help you uncover insights and patterns in your daily experiences.
            </p>
          </motion.div>
        </div>

        <div className="mt-12 text-center text-white/80 italic max-w-2xl drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          "The voice carries emotion that written words often miss."
        </div>

        <div className="mt-12">
          <Link href="/setup">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg font-medium transition-all"
            >
              Begin Your Journey
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}