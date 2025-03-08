"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Save, BarChart3, Users, Settings } from "lucide-react";
import { RecordingButton } from "../components/ui/recording-button";

// Define the prompts for reflection
const reflectionPrompts = [
  "What went well today?",
  "What did you do for someone else today?",
  "What can you do differently tomorrow?"
];

export default function TodayPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [summary, setSummary] = useState("");
  const [transcription, setTranscription] = useState("");
  const [mood, setMood] = useState(4); // 1-5 scale
  const [tasks, setTasks] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);

  // Simulate recording process
  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        if (currentPromptIndex < reflectionPrompts.length - 1) {
          setCurrentPromptIndex(currentPromptIndex + 1);
        } else {
          // Simulate recording completion
          setIsRecording(false);
          setRecordingComplete(true);
          
          // Simulate generated summary and extracted information
          setSummary("Today was quite productive. I made significant progress on the voice journaling app, particularly the UI components. The aurora background effect turned out really well, and I'm pleased with how the recording button works. I also helped a colleague debug an issue they were having with React state management. Tomorrow I should focus more on the backend integration and perhaps spend less time perfecting small UI details.");
          
          setTranscription("I had a good day working on the voice journaling app. The UI is coming along nicely, especially the aurora background effect that gives the app a unique feel. The recording button functionality is working well too. I spent some time helping Sarah with her React state management issue, which was a nice break from my own work. For tomorrow, I need to shift focus to the backend integration. I've been spending too much time on small UI details, so I should prioritize the core functionality first.");
          
          setTasks([
            "Focus on backend integration",
            "Prioritize core functionality",
            "Spend less time on UI details"
          ]);
          
          setPeople([
            "Sarah"
          ]);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isRecording, currentPromptIndex]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentPromptIndex(0);
    setRecordingComplete(false);
    setSummary("");
    setTranscription("");
    setTasks([]);
    setPeople([]);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col min-h-screen p-4 pt-8 pb-24">
        {/* Navigation Bar */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/10 py-1 px-1 rounded-full shadow-lg">
          <Link href="/today">
            <button className="px-4 py-2 rounded-full bg-indigo-500 text-white flex items-center gap-1">
              <span className="hidden md:inline">Today</span>
            </button>
          </Link>
          <Link href="/calendar">
            <button className="px-4 py-2 rounded-full text-white/80 hover:text-white flex items-center gap-1">
              <Calendar size={16} />
              <span className="hidden md:inline">Calendar</span>
            </button>
          </Link>
          <Link href="/insights">
            <button className="px-4 py-2 rounded-full text-white/80 hover:text-white flex items-center gap-1">
              <BarChart3 size={16} />
              <span className="hidden md:inline">Insights</span>
            </button>
          </Link>
          <Link href="/relationships">
            <button className="px-4 py-2 rounded-full text-white/80 hover:text-white flex items-center gap-1">
              <Users size={16} />
              <span className="hidden md:inline">Relationships</span>
            </button>
          </Link>
          <Link href="/settings">
            <button className="px-4 py-2 rounded-full text-white/80 hover:text-white flex items-center gap-1">
              <Settings size={16} />
              <span className="hidden md:inline">Settings</span>
            </button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto mt-16"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/landing">
              <button className="bg-black/40 hover:bg-black/50 text-white rounded-full px-4 py-2 flex items-center space-x-2 transition-all">
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              Today's Journal
            </h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {formatDate(new Date())}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Prompts and Recording */}
            <div className="flex flex-col">
              {/* Prompts */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-8 shadow-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Today's Reflection Prompts
                </h3>
                <ul className="space-y-4">
                  {reflectionPrompts.map((prompt, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0.7 }}
                      animate={{ 
                        opacity: isRecording && index === currentPromptIndex ? 1 : 0.7,
                        scale: isRecording && index === currentPromptIndex ? 1.05 : 1
                      }}
                      className={`p-4 rounded-lg ${
                        isRecording && index === currentPromptIndex 
                          ? 'bg-indigo-500/30 text-white' 
                          : 'bg-black/20 text-white/80'
                      } transition-all duration-300`}
                    >
                      {prompt}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Recording Button */}
              <div className="flex flex-col items-center justify-center flex-grow">
                <RecordingButton 
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  size="lg"
                />
                <p className="text-white/80 mt-4 text-center">
                  {isRecording 
                    ? "Recording... Click the stop button when finished." 
                    : recordingComplete 
                      ? "Recording complete! See your summary on the right." 
                      : "Click the microphone to start recording your journal entry."}
                </p>
              </div>
            </div>

            {/* Right side - Summary and Extracted Information */}
            <div className="flex flex-col">
              {recordingComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Summary */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 shadow-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      Summary
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  {/* Extracted Information */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 shadow-xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      Extracted Information
                    </h3>
                    
                    {/* Mood */}
                    <div className="mb-4">
                      <h4 className="text-white/80 font-medium mb-2">Mood</h4>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button 
                            key={value}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              value === mood 
                                ? 'bg-indigo-500 text-white' 
                                : 'bg-black/20 text-white/60'
                            }`}
                            onClick={() => setMood(value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tasks */}
                    <div className="mb-4">
                      <h4 className="text-white/80 font-medium mb-2">Tasks & To-Dos</h4>
                      <ul className="space-y-2">
                        {tasks.map((task, index) => (
                          <li key={index} className="flex items-center text-white/90">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* People */}
                    <div className="mb-4">
                      <h4 className="text-white/80 font-medium mb-2">People Mentioned</h4>
                      <div className="flex flex-wrap gap-2">
                        {people.map((person, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-indigo-500/30 rounded-full text-white/90"
                          >
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Full Transcription (Collapsed) */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
                    <details>
                      <summary className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] cursor-pointer">
                        Full Transcription
                      </summary>
                      <p className="text-white/80 leading-relaxed">
                        {transcription}
                      </p>
                    </details>
                  </div>
                  
                  {/* Save Button */}
                  <div className="mt-6 text-center">
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-6 py-3 shadow-lg font-medium flex items-center justify-center mx-auto">
                      <Save size={18} className="mr-2" />
                      Save Journal Entry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-8 text-center max-w-md">
                    <p className="text-white/70 text-lg">
                      Your journal summary and insights will appear here after you complete your recording.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
} 