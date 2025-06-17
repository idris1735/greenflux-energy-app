"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    let base = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none";
    let variantClass = "";
    let sizeClass = "";
    
    if (variant === "default") {
      variantClass = "bg-gradient-to-r from-[#fb923c] via-[#4ade80] to-[#f59e0b] text-white shadow-lg hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 relative overflow-hidden";
    } else if (variant === "outline") {
      variantClass = "border-2 border-white/30 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10";
    } else if (variant === "ghost") {
      variantClass = "bg-transparent text-white hover:bg-white/10";
    }

    if (size === "default") {
      sizeClass = "px-6 py-3 text-sm";
    } else if (size === "sm") {
      sizeClass = "px-4 py-2 text-xs";
    } else if (size === "lg") {
      sizeClass = "px-8 py-4 text-base";
    } else if (size === "icon") {
      sizeClass = "p-2";
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "default" && (
          <span className="absolute inset-0 bg-gradient-to-r from-[#fb923c] via-[#4ade80] to-[#f59e0b] opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full z-0" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button"; 