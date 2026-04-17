"use client"

import { cn } from "@/lib/utils"

interface ConsultationButtonProps {
  onClick?: () => void
  children?: React.ReactNode
  className?: string
}

export function ConsultationButton({ 
  onClick, 
  children = "Get Consultation",
  className
}: ConsultationButtonProps) {
  return (
    <button 
      className={cn("consultation-button", className)} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}
