"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  borderWidth = 2,
  colors = ["#2563eb", "#4f46e5", "#8b5cf6", "#a855f7"],
  as: Component = "button",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  borderWidth?: number;
  colors?: string[];
  as?: any;
  [key: string]: any;
}) => {
  const borderRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!borderRef.current) return;
    
    const rect = borderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
  };

  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      ref={borderRef}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from ${position.x / 2}deg at ${position.x}px ${position.y}px, ${colors.join(", ")})`,
          borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
          filter: "blur(8px)",
        }}
      />
      
      <Component
        className={cn(
          "relative bg-zinc-950 dark:bg-zinc-900 text-white border-none flex items-center justify-center",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
        }}
        {...otherProps}
      >
        {children}
      </Component>
    </div>
  );
}; 