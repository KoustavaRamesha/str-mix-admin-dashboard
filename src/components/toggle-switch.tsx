'use client'

import React from 'react'
import './toggle-switch.css'

interface ToggleSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  id?: string
  name?: string
  disabled?: boolean
}

export function ToggleSwitch({
  checked = false,
  onChange,
  id,
  name,
  disabled = false,
}: ToggleSwitchProps) {
  const generatedId = React.useId()
  const switchId = id || generatedId
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <label className="switch">
      <input
        id={switchId}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
      />
      <div className="slider">
        <div className="circle">
          {/* Checkmark icon */}
          <svg
            className="checkmark"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1.5 5.5 3.5 7.5 8.5 2.5" />
          </svg>
          {/* Cross icon */}
          <svg
            className="cross"
            viewBox="0 0 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="1" y1="1" x2="5" y2="5" />
            <line x1="5" y1="1" x2="1" y2="5" />
          </svg>
        </div>
      </div>
    </label>
  )
}

export default ToggleSwitch
