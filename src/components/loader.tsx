'use client'

import React from 'react'
import './loader.css'

interface LoaderProps {
  size?: number
  label?: string
  fullScreen?: boolean
}

export function Loader({ size = 1, label, fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="loader" style={{ '--size': size } as React.CSSProperties}>
        <div className="box">
          <svg viewBox="0 0 100 100" width="100" height="100">
            <defs>
              <clipPath id="clipping">
                <polygon points="50,25 75,50 75,75 25,75 25,50" />
                <polygon points="50,50 75,50 75,75 50,75 50,50" />
                <polygon points="25,25 50,50 50,75 25,50" />
                <polygon points="50,50 75,75 50,100 25,75" />
                <polygon points="25,50 50,75 25,100" />
                <polygon points="75,50 100,75 75,100" />
                <polygon points="50,25 75,50 50,75 25,50" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      {label && <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background industrial-grid p-4 flex-col gap-6">
        {content}
      </div>
    )
  }

  return content
}

export default Loader
