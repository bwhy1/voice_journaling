"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Edit, Clock } from "lucide-react";
import { RecordingButton } from "../components/ui/recording-button";

// Define the prompts for reflection
const reflectionPrompts = [
  "What went well today?",
  "What did you do for someone else today?",
  "What can you do differently tomorrow?"
];

// Mock data for past recordings
const mockRecordings: { [date: string]: any } = {
  "2023-06-15": {
    summary: "Had a productive day working on the project. Made good progress on the frontend components and fixed several bugs. Also had a helpful meeting with the team to discuss next steps.",
    transcription: "Today was pretty good. I spent most of the morning working on those frontend components we talked about yesterday. Got through most of the list and fixed a couple of bugs that had been bothering me. The team meeting in the afternoon was helpful - we clarified the roadmap for the next sprint and I got some good feedback on my work. I also helped Alex with his React issue, which didn't take too long but I think he appreciated it. Tomorrow I should focus more on the API integration and maybe spend a bit less time perfecting the UI details before the core functionality is working.",
    mood: 4,
    tasks: [
      "Focus on API integration",
      "Complete the authentication flow",
      "Review pull requests"
    ],
    people: [
      "Alex",
      "Team"
    ]
  }
};

interface PageProps {
  searchParams: { date?: string };
}

export default function DayPage({ searchParams }: PageProps) {
  const [isToday, setIsToday] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [summary, setSummary] = useState("");
  const [transcription, setTranscription] = useState("");
  const [mood, setMood] = useState(3);
  const [tasks, setTasks] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [hasRecording, setHasRecording] = useState(false);

  // Parse the date from URL params
  useEffect(() => {
    if (searchParams.date) {
      const paramDate = new Date(searchParams.date);
      setDate(paramDate);
      
      // Check if the date is today
      const today = new Date();
      const isDateToday = paramDate.getDate() === today.getDate() &&
                          paramDate.getMonth() === today.getMonth() &&
                          paramDate.getFullYear() === today.getFullYear();
      setIsToday(isDateToday);
      
      // Check if we have a recording for this date
      const dateString = searchParams.date;
      if (mockRecordings[dateString]) {
        setRecordingComplete(true);
        setSummary(mockRecordings[dateString].summary);
        setTranscription(mockRecordings[dateString].transcription);
        setMood(mockRecordings[dateString].mood);
        setTasks(mockRecordings[dateString].tasks);
        setPeople(mockRecordings[dateString].people);
        setHasRecording(true);
      } else {
        setRecordingComplete(false);
        setHasRecording(false);
      }
    } else {
      // If no date provided, default to today
      setDate(new Date());
      setIsToday(true);
    }
  }, [searchParams.date]);

  // Simulate recording process (only for today)
  useEffect(() => {
    if (isRecording && isToday) {
      const timer = setTimeout(() => {
        if (currentPromptIndex < reflectionPrompts.length - 1) {
          setCurrentPromptIndex(currentPromptIndex + 1);
        } else {
          // Simulate recording completion
          setIsRecording(false);
          setRecordingComplete(true);
          setHasRecording(true);
          
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
  }, [isRecording, currentPromptIndex, isToday]);

  const handleStartRecording = () => {
    if (isToday) {
      setIsRecording(true);
      setCurrentPromptIndex(0);
      setRecordingComplete(false);
      setSummary("");
      setTranscription("");
      setTasks([]);
      setPeople([]);
    }
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
      <div className="flex flex-col min-h-screen p-4 pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/calendar">
              <button className="bg-black/40 hover:bg-black/50 text-white rounded-full px-4 py-2 flex items-center space-x-2 transition-all">
                <ChevronLeft size={16} />
                <span>Back to Calendar</span>
              </button>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {isToday ? "Today's Journal" : "Journal Entry"}
            </h1>
            {isToday ? (
              <Link href="/calendar">
                <button className="bg-black/40 hover:bg-black/50 text-white rounded-full px-4 py-2 flex items-center space-x-2 transition-all">
                  <Calendar size={16} />
                  <span>Calendar</span>
                </button>
              </Link>
            ) : (
              <div className="w-[140px]"></div> // Spacer for alignment
            )}
          </div>

          <div className="text-center mb-6 flex items-center justify-center">
            <h2 className="text-xl text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {formatDate(date)}
            </h2>
            {!isToday && (
              <div className="ml-3 px-3 py-1 bg-black/30 rounded-full text-white/80 text-sm flex items-center">
                <Clock size={14} className="mr-1" />
                Past Entry
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Prompts and Recording */}
            <div className="flex flex-col">
              {/* Prompts */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-8 shadow-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Reflection Prompts
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

              {/* Recording Button or Past Entry Notice */}
              <div className="flex flex-col items-center justify-center flex-grow">
                {isToday ? (
                  <>
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
                  </>
                ) : (
                  <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 text-center max-w-md">
                    {hasRecording ? (
                      <>
                        <div className="text-white/90 mb-3">
                          This is a past journal entry.
                        </div>
                        <div className="text-white/70 text-sm">
                          Recording is only available for today's entry.
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-white/90 mb-3">
                          No journal entry for this date.
                        </div>
                        <Link href="/today">
                          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-4 py-2 mt-2 shadow-lg font-medium">
                            Record Today's Entry
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Summary and Extracted Information */}
            <div className="flex flex-col">
              {recordingComplete || hasRecording ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Summary */}
                  <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 shadow-xl border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        Summary
                      </h3>
                      {isToday && (
                        <button className="text-white/70 hover:text-white flex items-center text-sm">
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                      )}
                    </div>
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
                            onClick={isToday ? () => setMood(value) : undefined}
                            disabled={!isToday}
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
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-8 text-center max-w-md">
                    <p className="text-white/70 text-lg">
                      {isToday 
                        ? "Your journal summary and insights will appear here after you complete your recording."
                        : "No journal entry found for this date."}
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
