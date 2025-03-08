"use client";

import { AuroraBackground } from "../components/ui/aurora-background";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bell, Moon, Lock, Database, User } from "lucide-react";

export default function SettingsPage() {
  const [promptPreference, setPromptPreference] = useState<"morning" | "evening">("evening");
  const [notificationTime, setNotificationTime] = useState("21:00");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataExportFormat, setDataExportFormat] = useState<"json" | "pdf" | "txt">("pdf");

  return (
    <AuroraBackground>
      <div className="flex flex-col min-h-screen p-4 pt-8 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mx-auto"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] mb-8">
            Settings
          </h1>

          <div className="space-y-6 mb-8">
            {/* Prompt Preferences */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center mb-4">
                <Moon size={20} className="text-indigo-300 mr-3" />
                <h2 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Prompt Preferences
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white/90">Prompt Type</label>
                  <div className="flex bg-black/20 rounded-full p-1">
                    <button
                      className={`px-4 py-1 rounded-full text-sm ${
                        promptPreference === "morning" 
                          ? "bg-indigo-500 text-white" 
                          : "text-white/70"
                      }`}
                      onClick={() => setPromptPreference("morning")}
                    >
                      Morning
                    </button>
                    <button
                      className={`px-4 py-1 rounded-full text-sm ${
                        promptPreference === "evening" 
                          ? "bg-indigo-500 text-white" 
                          : "text-white/70"
                      }`}
                      onClick={() => setPromptPreference("evening")}
                    >
                      Evening
                    </button>
                  </div>
                </div>
                
                <div className="text-white/70 text-sm">
                  <p>
                    <strong>Morning prompts</strong> focus on setting intentions for the day ahead.
                  </p>
                  <p>
                    <strong>Evening prompts</strong> focus on reflecting on the day that passed.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center mb-4">
                <Bell size={20} className="text-indigo-300 mr-3" />
                <h2 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Notification Settings
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white/90">Enable Notifications</label>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      notificationsEnabled ? "bg-indigo-500" : "bg-black/40"
                    }`}
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        notificationsEnabled ? "translate-x-6" : ""
                      }`} 
                    />
                  </div>
                </div>
                
                {notificationsEnabled && (
                  <div className="flex items-center justify-between">
                    <label className="text-white/90">Reminder Time</label>
                    <input
                      type="time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="bg-black/20 text-white border border-white/10 rounded-md px-3 py-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Controls */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center mb-4">
                <Lock size={20} className="text-indigo-300 mr-3" />
                <h2 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Privacy Controls
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white/90">Dark Mode</label>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                      darkMode ? "bg-indigo-500" : "bg-black/40"
                    }`}
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        darkMode ? "translate-x-6" : ""
                      }`} 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-white/90">Biometric Lock</label>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors bg-black/40`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center mb-4">
                <Database size={20} className="text-indigo-300 mr-3" />
                <h2 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Data Management
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white/90">Export Format</label>
                  <select
                    value={dataExportFormat}
                    onChange={(e) => setDataExportFormat(e.target.value as any)}
                    className="bg-black/20 text-white border border-white/10 rounded-md px-3 py-1"
                  >
                    <option value="pdf">PDF</option>
                    <option value="json">JSON</option>
                    <option value="txt">Text</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-2 text-sm">
                    Export Data
                  </button>
                  <button className="bg-red-500/30 hover:bg-red-500/50 text-white rounded-md px-4 py-2 text-sm">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10">
              <div className="flex items-center mb-4">
                <User size={20} className="text-indigo-300 mr-3" />
                <h2 className="text-xl font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Account Settings
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-white/90">Account Type</label>
                  <span className="bg-black/20 text-white/80 px-3 py-1 rounded-md text-sm">
                    Free
                  </span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md px-4 py-2 text-sm">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
} 