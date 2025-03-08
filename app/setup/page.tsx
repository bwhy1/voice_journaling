"use client";

import React, { useState, useEffect, useRef } from "react";
import { AuroraBackground } from "@/app/components/ui/aurora-background";
import { RecordingButton } from "@/app/components/ui/recording-button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [welcomePlayed, setWelcomePlayed] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulated conversation flow
  const conversationSteps = [
    {
      message: "Welcome to Voice Journaling! I'm here to help you set up your personalized journaling experience.",
      audio: "/welcome.mp3" // This would be a pre-recorded welcome message
    },
    {
      message: "What are your main goals for journaling? For example, self-reflection, tracking mood, or documenting memories?",
      audio: "/goals.mp3"
    },
    {
      message: "Great! Based on your goals, I'll customize your daily prompts to help you get the most out of your journaling experience.",
      audio: "/confirmation.mp3"
    }
  ];

  useEffect(() => {
    // Simulate audio playing when the component mounts
    if (step === 0 && !welcomePlayed) {
      const timer = setTimeout(() => {
        setWelcomePlayed(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, welcomePlayed]);

  useEffect(() => {
    // Move to the next step after welcome is played
    if (step === 0 && welcomePlayed) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [welcomePlayed, step]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, this would start the actual recording
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Simulate processing the user's response
    if (step === 1) {
      // In a real app, this would process the speech to text
      setUserResponse("I want to track my daily thoughts and reflect on my personal growth.");
      
      // Move to the next step after a delay
      setTimeout(() => {
        setStep(2);
      }, 1500);
      
      // In a real app, this would save the user's preferences
      setTimeout(() => {
        router.push("/day");
      }, 5000);
    }
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {step < conversationSteps.length && (
            <motion.div
              key={`message-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 max-w-xl"
            >
              <h2 className="text-2xl md:text-3xl font-light dark:text-white mb-4">
                {conversationSteps[step].message}
              </h2>
              
              {step === 1 && userResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg"
                >
                  <p className="text-lg italic">"{userResponse}"</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.3 
          }}
          className="relative"
        >
          <RecordingButton
            size="lg"
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
          
          {step === 0 && !welcomePlayed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <p className="text-sm text-white/70">Tap to begin</p>
            </motion.div>
          )}
        </motion.div>
        
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-lg dark:text-white/70">
              Setting up your personalized experience...
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AuroraBackground>
  );
} 