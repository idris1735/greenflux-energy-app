"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`block w-full rounded-lg border-2 border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 ${className}`}
      {...props}
    />
  )
)

Input.displayName = "Input"; 