"use client"

import React from "react"
import "./star-rating.css"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  readOnly?: boolean
}

export function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  return (
    <div className="rating">
      {[5, 4, 3, 2, 1].map((rating) => (
        <React.Fragment key={rating}>
          <input
            type="radio"
            id={`star${rating}`}
            name="rating"
            value={rating}
            checked={value === rating}
            onChange={() => !readOnly && onChange(rating)}
            disabled={readOnly}
          />
          <label htmlFor={`star${rating}`} title={`${rating} star${rating !== 1 ? 's' : ''}`}></label>
        </React.Fragment>
      ))}
    </div>
  )
}
