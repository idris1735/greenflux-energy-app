"use client"
import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div className={`rounded-xl shadow-lg bg-[#0a1833] text-white ${className}`} {...props} />
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function CardContent({ className = "", ...props }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`} {...props} />
  )
} 