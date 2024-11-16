'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface RatingProps {
  totalStars?: number
  onChange?: (rating: number) => void
  initialRating?: number
  readOnly?: boolean
}

export function RatingComponent({ totalStars = 5, onChange, initialRating = 0, readOnly = false }: RatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleClick = (value: number) => {
    if (!readOnly) {
      setRating(value)
      if (onChange) {
        onChange(value)
      }
    }
  }

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const value = index + 1
        return (
          <Star
            key={index}
            className={`w-5 h-5 ${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            } ${
              value <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onMouseEnter={() => !readOnly && setHover(value)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => handleClick(value)}
          />
        )
      })}
    </div>
  )
}