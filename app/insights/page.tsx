"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">("weekly");

  return (
    <AuroraBackground>
      <div className="relative flex flex-col gap-4 items-center justify-center px-4 py-8 pb-24 min-h-screen">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 max-w-6xl mx-auto w-full"
        >
          <div className="text-3xl md:text-7xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            Insights
          </div>
          <div className="font-extralight text-base md:text-2xl text-white py-4 text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            Discover patterns and trends in your journaling journey
          </div>

          {/* Time period tabs */}
          <div className="flex space-x-2 bg-black/30 backdrop-blur-md rounded-full p-1 my-6 shadow-lg">
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "weekly" ? "bg-white text-black" : "text-white hover:bg-white/10"
              } transition-all`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "monthly" ? "bg-white text-black" : "text-white hover:bg-white/10"
              } transition-all`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActiveTab("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === "yearly" ? "bg-white text-black" : "text-white hover:bg-white/10"
              } transition-all`}
            >
              Yearly
            </button>
          </div>

          {/* Insights content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Mood tracking */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Mood Tracking</h3>
              <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
                <p className="text-white/80 font-medium">Mood visualization will appear here</p>
              </div>
            </div>

            {/* Theme identification */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Common Themes</h3>
              <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
                <p className="text-white/80 font-medium">Theme analysis will appear here</p>
              </div>
            </div>

            {/* Pattern recognition */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Pattern Recognition</h3>
              <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
                <p className="text-white/80 font-medium">Pattern visualization will appear here</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Achievements</h3>
              <div className="h-48 bg-black/20 rounded-lg flex items-center justify-center">
                <p className="text-white/80 font-medium">Your achievements will appear here</p>
              </div>
            </div>
          </div>

          {/* Personalized observations */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 w-full mt-6 shadow-xl border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Personalized Observations</h3>
            <p className="text-white/90 leading-relaxed">
              Based on your journaling patterns, we've noticed you tend to feel more positive on weekends
              and when you mention outdoor activities. Consider scheduling more outdoor time during the week.
            </p>
          </div>

          <div className="mt-8 mb-8">
            <Link href="/landing">
              <button className="bg-black/40 hover:bg-black/50 backdrop-blur-md text-white rounded-full px-6 py-3 transition-all shadow-lg font-medium">
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
} 