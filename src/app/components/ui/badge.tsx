"use client"
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

export function Badge({ className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 ${className}`}
      {...props}
    >
      {children}
    </span>
  )
} 