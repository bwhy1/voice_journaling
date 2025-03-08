"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import Link from "next/link";
import { RecordingButton } from "../components/ui/recording-button";

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulate conversation flow
  useEffect(() => {
    if (isRecording && step === 2) {
      const timer = setTimeout(() => {
        setIsRecording(false);
        setStep(3);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isRecording, step]);

  // Simulate progress for final step
  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStartRecording = () => {
    setIsRecording(true);
    if (step === 1) {
      setTimeout(() => {
        setIsRecording(false);
        setStep(2);
      }, 3000);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (step === 2) {
      setStep(3);
    }
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto text-center mb-8"
        >
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                Welcome to Voice Journaling
              </h1>
              <p className="text-white text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                Let's set up your personalized journaling experience. I'll ask you a few questions to understand your goals.
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                What are your journaling goals?
              </h1>
              <p className="text-white text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                Are you looking to track your mood, capture memories, or develop self-awareness?
              </p>
              {isRecording ? (
                <p className="text-white/90 text-sm mt-4 bg-black/30 p-3 rounded-lg shadow-inner animate-pulse">
                  Listening... Click the stop button when finished.
                </p>
              ) : (
                <p className="text-white/90 text-sm mt-4 bg-black/30 p-3 rounded-lg shadow-inner">
                  Click the microphone button to record your answer.
                </p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                Perfect! Setting up your experience
              </h1>
              <p className="text-white text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                Based on your goals, I'm personalizing your daily prompts and journaling experience.
              </p>
              
              <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden mt-6">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {progress === 100 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <Link href="/day">
                    <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg font-medium">
                      Start Journaling
                    </button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {step < 3 && (
          <div className="relative">
            <RecordingButton 
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              size="lg"
            />
          </div>
        )}
      </div>
    </AuroraBackground>
  );
} 