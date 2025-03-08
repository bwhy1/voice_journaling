"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecordingButton } from "../components/ui/recording-button";
import {
  initializeRetellClient,
  startRetellCall,
  stopRetellCall,
  SETUP_AGENT_ID,
  RetellUpdate,
} from "@/lib/retell";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);

  // Initialize Retell client
  useEffect(() => {
    initializeRetellClient(
      // Call started
      () => setIsCalling(true),
      // Call ended
      () => {
        setIsCalling(false);
        setIsRecording(false);
        if (step < 3) {
          setStep(prev => prev + 1);
        }
      },
      // Agent start talking
      () => {},
      // Agent stop talking
      () => {},
      // Updates (including transcript)
      (update: RetellUpdate) => {
        if (update.transcript) {
          if (typeof update.transcript === 'string') {
            setTranscript(update.transcript);
          }
        }
      },
      // Error handling
      (error: Error) => {
        console.error('Retell error:', error);
        setIsCalling(false);
        setIsRecording(false);
      }
    );

    // Cleanup on unmount
    return () => {
      if (isCalling) {
        stopRetellCall();
      }
    };
  }, [isCalling, step]);

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

  useEffect(() => {
    if (step === 3 && progress === 100) {
      console.log("Ready for journaling - button should be visible");
    }
  }, [step, progress]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    setTranscript(""); // Clear previous transcript
    
    // Start Retell call with appropriate metadata based on step
    const metadata = {
      step,
      context: step === 1 ? 'initial_setup' : 'journaling_goals',
    };

    const result = await startRetellCall(SETUP_AGENT_ID, metadata);
    
    if (!result.success) {
      console.error('Failed to start Retell call');
      setIsRecording(false);
      return;
    }

    if (result.call_id) {
      setCallId(result.call_id);
      localStorage.setItem('setupCallId', result.call_id);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRetellCall();
  };

  const handleStartJournaling = () => {
    console.log("Button clicked - handleStartJournaling");
    window.location.href = '/record';
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
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg"
                >
                  <p className="text-white/90 text-left whitespace-pre-wrap">{transcript}</p>
                </motion.div>
              )}
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
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg"
                >
                  <p className="text-white/90 text-left whitespace-pre-wrap">{transcript}</p>
                </motion.div>
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
                  <button
                    onClick={handleStartJournaling}
                    type="button"
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg font-medium hover:opacity-90 active:opacity-100 transition-opacity cursor-pointer z-50"
                  >
                    Start Journaling
                  </button>
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