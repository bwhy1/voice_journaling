"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, User, Users, Calendar, Clock } from "lucide-react";

// Mock data for relationships
const mockRelationships = [
  { id: 1, name: "Sarah", frequency: 12, sentiment: 0.8, lastMention: "2023-06-10" },
  { id: 2, name: "Alex", frequency: 8, sentiment: 0.9, lastMention: "2023-06-15" },
  { id: 3, name: "Team", frequency: 15, sentiment: 0.7, lastMention: "2023-06-18" },
  { id: 4, name: "Mom", frequency: 5, sentiment: 0.95, lastMention: "2023-06-05" },
  { id: 5, name: "Dad", frequency: 4, sentiment: 0.9, lastMention: "2023-06-02" },
  { id: 6, name: "Michael", frequency: 3, sentiment: 0.6, lastMention: "2023-05-28" },
  { id: 7, name: "Emma", frequency: 2, sentiment: 0.85, lastMention: "2023-05-20" },
];

export default function RelationshipsPage() {
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month");

  // Get the selected person's data
  const getSelectedPersonData = () => {
    if (selectedPerson === null) return null;
    return mockRelationships.find(person => person.id === selectedPerson);
  };

  // Calculate position based on sentiment (closer = more positive)
  const calculatePosition = (sentiment: number, index: number, total: number) => {
    // Create a circular layout
    const angle = (index / total) * 2 * Math.PI;
    // Radius depends on sentiment (higher sentiment = closer to center)
    const radius = 150 - sentiment * 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  // Calculate size based on frequency
  const calculateSize = (frequency: number) => {
    const minSize = 40;
    const maxSize = 80;
    const maxFrequency = Math.max(...mockRelationships.map(r => r.frequency));
    return minSize + (frequency / maxFrequency) * (maxSize - minSize);
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col min-h-screen p-4 pt-8 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl mx-auto"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] mb-8">
            Relationships
          </h1>

          {/* Time range selector */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-black/30 backdrop-blur-md rounded-full p-1">
              <button
                className={`px-4 py-2 rounded-full text-sm ${
                  timeRange === "month" 
                    ? "bg-indigo-500 text-white" 
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setTimeRange("month")}
              >
                Month
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${
                  timeRange === "quarter" 
                    ? "bg-indigo-500 text-white" 
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setTimeRange("quarter")}
              >
                Quarter
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${
                  timeRange === "year" 
                    ? "bg-indigo-500 text-white" 
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => setTimeRange("year")}
              >
                Year
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Network Visualization */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10 flex items-center justify-center aspect-square overflow-hidden isolate">
              <div className="relative w-full h-full max-w-xs max-h-xs mx-auto isolation-auto">
                {/* Center user */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg z-10">
                  <User size={24} className="text-white" />
                </div>
                
                {/* Connections */}
                {mockRelationships.map((person, index) => {
                  const position = calculatePosition(person.sentiment, index, mockRelationships.length);
                  const size = calculateSize(person.frequency);
                  
                  return (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x: position.x,
                        y: position.y,
                      }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: 0.5,
                        type: "spring",
                      }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setSelectedPerson(person.id)}
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer ${
                        selectedPerson === person.id ? "ring-2 ring-white" : ""
                      }`}
                      style={{ 
                        width: `${size}px`, 
                        height: `${size}px`,
                        backgroundColor: `rgba(99, 102, 241, ${person.sentiment})`,
                        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                      }}
                    >
                      <span className="text-white font-medium text-xs">
                        {person.name}
                      </span>
                    </motion.div>
                  );
                })}
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  {mockRelationships.map((person, index) => {
                    const position = calculatePosition(person.sentiment, index, mockRelationships.length);
                    return (
                      <motion.line
                        key={`line-${person.id}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: selectedPerson === person.id ? 0.8 : 0.3,
                          stroke: selectedPerson === person.id ? "white" : "rgba(255, 255, 255, 0.3)",
                        }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        x1="50%"
                        y1="50%"
                        x2={`calc(50% + ${position.x}px)`}
                        y2={`calc(50% + ${position.y}px)`}
                        strokeWidth={selectedPerson === person.id ? 2 : 1}
                        strokeDasharray="5,5"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Person Details */}
            <div className="flex flex-col">
              {selectedPerson ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10 h-full"
                >
                  {(() => {
                    const person = getSelectedPersonData();
                    if (!person) return null;
                    
                    return (
                      <>
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white text-xl font-bold">{person.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">{person.name}</h2>
                            <div className="flex items-center mt-1">
                              <Clock size={14} className="text-indigo-300 mr-1" />
                              <span className="text-white/70 text-sm">
                                Last mentioned {new Date(person.lastMention).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {/* Sentiment */}
                          <div>
                            <h3 className="text-white/80 font-medium mb-2 flex items-center">
                              <Heart size={16} className="text-indigo-300 mr-2" />
                              Relationship Sentiment
                            </h3>
                            <div className="w-full bg-black/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                style={{ width: `${person.sentiment * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-white/60 text-xs">Neutral</span>
                              <span className="text-white/60 text-xs">Positive</span>
                            </div>
                          </div>
                          
                          {/* Frequency */}
                          <div>
                            <h3 className="text-white/80 font-medium mb-2 flex items-center">
                              <Calendar size={16} className="text-indigo-300 mr-2" />
                              Mention Frequency
                            </h3>
                            <p className="text-white/90">
                              Mentioned <span className="font-bold">{person.frequency} times</span> in your journal entries.
                            </p>
                          </div>
                          
                          {/* Associated Entries */}
                          <div>
                            <h3 className="text-white/80 font-medium mb-2 flex items-center">
                              <Users size={16} className="text-indigo-300 mr-2" />
                              Recent Entries
                            </h3>
                            <ul className="space-y-2">
                              <li className="bg-black/20 p-3 rounded-lg">
                                <div className="text-white/90 font-medium">June 15, 2023</div>
                                <p className="text-white/70 text-sm mt-1">
                                  "...had a great conversation with {person.name} about the project..."
                                </p>
                              </li>
                              <li className="bg-black/20 p-3 rounded-lg">
                                <div className="text-white/90 font-medium">June 10, 2023</div>
                                <p className="text-white/70 text-sm mt-1">
                                  "...{person.name} helped me figure out the solution to..."
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Users size={48} className="text-indigo-300 mx-auto mb-4 opacity-50" />
                    <p className="text-white/70 text-lg">
                      Select a person to view relationship details
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