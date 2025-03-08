"use client";

import React from "react";
import { NavBar } from "./ui/tubelight-navbar";
import { Calendar, Mic, BarChart3, Users, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  // Skip navbar for landing and setup pages
  if (pathname === "/" || pathname === "/landing" || pathname === "/setup") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Today", url: "/today", icon: Mic },
    { name: "Calendar", url: "/calendar", icon: Calendar },
    { name: "Insights", url: "/insights", icon: BarChart3 },
    { name: "Relationships", url: "/relationships", icon: Users },
    { name: "Settings", url: "/settings", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen">
      {children}
      <NavBar 
        items={navItems} 
        className="bg-black/30 border-white/10"
      />
      {/* Add padding at the bottom for mobile to account for the navbar */}
      <div className="h-24 sm:h-0"></div>
    </div>
  );
} 