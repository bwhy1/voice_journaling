"use client";

import React, { useState } from "react";
import { Button } from "./moving-border-button";
import { Mic, MicOff, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RecordingButtonProps {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPauseRecording?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RecordingButton({
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  className,
  size = "md",
}: RecordingButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRecording) {
      if (isPaused) {
        setIsPaused(false);
        onStartRecording?.();
      } else {
        setIsPaused(true);
        onPauseRecording?.();
      }
    } else {
      setIsRecording(true);
      onStartRecording?.();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRecording(false);
    setIsPaused(false);
    onStopRecording?.();
  };

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className="relative">
      <Button
        as="div"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        containerClassName={cn("aspect-square rounded-full", sizeClasses[size], className)}
        borderClassName={cn(
          isRecording
            ? isPaused
              ? "bg-[radial-gradient(var(--amber-500)_40%,transparent_60%)]"
              : "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
            : isHovered
              ? "bg-[radial-gradient(var(--indigo-500)_40%,transparent_60%)]"
              : "bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]"
        )}
        className={cn(
          "rounded-full flex items-center justify-center transition-all duration-300",
          isHovered && !isRecording && "scale-105"
        )}
        duration={isRecording ? 1500 : isHovered ? 2000 : 3000}
        borderRadius="50%"
      >
        <div className="relative flex items-center justify-center">
          {isRecording ? (
            isPaused ? (
              <Mic className={cn(iconSizes[size], "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]")} />
            ) : (
              <>
                <Mic className={cn(iconSizes[size], "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]")} />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500/70"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                />
              </>
            )
          ) : (
            <Mic 
              className={cn(
                iconSizes[size], 
                "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]",
                isHovered && "scale-110 transition-transform duration-300"
              )} 
            />
          )}
        </div>
      </Button>

      {isRecording && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-red-500 rounded-full p-2 shadow-lg"
          onClick={handleStop}
        >
          <MicOff className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
} 