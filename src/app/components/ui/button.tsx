"use client"
import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    let base =
      "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none px-8 py-4 text-base";
    let variantClass = "";
    if (variant === "default") {
      variantClass =
        "bg-gradient-to-r from-[#fb923c] via-[#4ade80] to-[#f59e0b] text-white shadow-lg hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 relative overflow-hidden";
    } else if (variant === "outline") {
      variantClass =
        "border-2 border-white/30 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10";
    } else if (variant === "ghost") {
      variantClass =
        "bg-transparent text-white hover:bg-white/10";
    }
    return (
      <button
        ref={ref}
        className={`${base} ${variantClass} ${className}`}
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
export default Button; 