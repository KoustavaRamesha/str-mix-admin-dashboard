import React from "react"
import "./gradient-button.css"

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function GradientButton({
  children,
  ...props
}: GradientButtonProps) {
  return (
    <button className="button" {...props}>
      <span>{children}</span>
    </button>
  )
}
