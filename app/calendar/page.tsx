"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define recording type
interface Recording {
  summary: string;
}

// Define recordings map type
interface RecordingsMap {
  [date: string]: Recording;
}

// Sample summaries for mock data
const summaries = [
  "Today was productive. I completed the project ahead of schedule and received positive feedback.",
  "Had a challenging day with some setbacks on the new feature, but learned valuable lessons.",
  "Great meeting with the team. We aligned on goals and I feel motivated about our direction.",
  "Took some time for self-care today. Meditation and a long walk helped clear my mind.",
  "Celebrated a small win today. The presentation went well and I received good questions.",
  "Feeling grateful for my support network. Had a meaningful conversation with a mentor."
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [mockRecordings, setMockRecordings] = useState<RecordingsMap>({});
  const [streakCount, setStreakCount] = useState(0);
  const [showStreak, setShowStreak] = useState(false);

  // Generate mock data on client-side only to avoid hydration errors
  useEffect(() => {
    // Generate mock data for the current month
    const generateMockRecordings = (): RecordingsMap => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      
      // Format as YYYY-MM-DD
      const formatDate = (year: number, month: number, day: number) => {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      };
      
      // Create mock recordings for random days in the current month
      const recordings: RecordingsMap = {};
      
      // Add entry for today
      const todayDate = formatDate(currentYear, currentMonth, today.getDate());
      recordings[todayDate] = { summary: "Today I worked on my voice journaling app. Made good progress on the UI and functionality." };
      
      // Add consecutive entries for streak calculation
      let streak = 1;
      for (let i = 1; i <= 3; i++) {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - i);
        
        // Only add if it's still in the current month
        if (yesterday.getMonth() + 1 === currentMonth) {
          const yesterdayDate = formatDate(currentYear, currentMonth, yesterday.getDate());
          recordings[yesterdayDate] = { 
            summary: summaries[Math.floor(Math.random() * summaries.length)] 
          };
          streak++;
        }
      }
      
      // Add some random past entries
      for (let i = 0; i < 3; i++) {
        const randomDay = Math.max(1, Math.floor(Math.random() * (today.getDate() - 5)));
        const dateString = formatDate(currentYear, currentMonth, randomDay);
        
        // Don't overwrite existing entries
        if (!recordings[dateString]) {
          recordings[dateString] = { 
            summary: summaries[Math.floor(Math.random() * summaries.length)] 
          };
        }
      }
      
      // Calculate streak
      setStreakCount(streak);
      setShowStreak(streak > 1);
      
      return recordings;
    };

    setMockRecordings(generateMockRecordings());
  }, []);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setSelectedRecording(null);
  };

  // Next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setSelectedRecording(null);
  };

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Handle day selection
  const handleDayClick = (day: number) => {
    const dateString = formatDate(currentYear, currentMonth, day);
    setSelectedDate(dateString);
    
    // Check if there's a recording for this date
    if (mockRecordings[dateString]) {
      setSelectedRecording(mockRecordings[dateString]);
    } else {
      setSelectedRecording(null);
    }
  };

  // Get month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDate(currentYear, currentMonth, day);
    const hasRecording = mockRecordings[dateString] !== undefined;
    const isSelected = dateString === selectedDate;
    const isToday = day === new Date().getDate() && 
                    currentMonth === new Date().getMonth() && 
                    currentYear === new Date().getFullYear();
    
    calendarDays.push(
      <div 
        key={day}
        className={`
          h-12 md:h-16 flex items-center justify-center rounded-lg cursor-pointer
          ${hasRecording ? 'bg-green-500/30 hover:bg-green-500/50' : 'bg-black/20 hover:bg-black/30'}
          ${isSelected ? 'ring-2 ring-white' : ''}
          ${isToday ? 'border-2 border-indigo-400' : ''}
          transition-all duration-200
        `}
        onClick={() => handleDayClick(day)}
      >
        <span className="text-white font-medium">{day}</span>
      </div>
    );
  }

  return (
    <AuroraBackground>
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mx-auto"
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
              Journal Calendar
            </h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>

          {/* Streak counter - only show if there's a streak */}
          {showStreak && (
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 mb-6 text-center">
              <p className="text-white text-lg">
                <span className="font-bold">{streakCount} day</span> streak! Keep it going!
              </p>
            </div>
          )}

          {/* Month navigation */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth}
              className="bg-black/40 hover:bg-black/50 text-white rounded-full p-2 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="bg-black/40 hover:bg-black/50 text-white rounded-full p-2 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-white/80 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {calendarDays}
          </div>

          {/* Selected day details */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/40 backdrop-blur-md rounded-xl p-6 mt-6 shadow-xl border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {selectedRecording ? (
                <div>
                  <p className="text-white/90 leading-relaxed mb-4">
                    {selectedRecording.summary}
                  </p>
                  <Link href={`/day?date=${selectedDate}`}>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-4 py-2 mt-2 shadow-lg font-medium">
                      View Full Entry
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-white/80">No journal entry for this day.</p>
                  <Link href={`/day?date=${selectedDate}`}>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-4 py-2 mt-4 shadow-lg font-medium">
                      Create Entry
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
