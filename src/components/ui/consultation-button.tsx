"use client"

import "./consultation-button.css"

interface ConsultationButtonProps {
  onClick?: () => void
  children?: React.ReactNode
}

export function ConsultationButton({ 
  onClick, 
  children = "Start Consultation" 
}: ConsultationButtonProps) {
  return (
    <button 
      className="consultation-button" 
      onClick={onClick}
    >
      {children}
    </button>
  )
}
