'use client'

import { useEffect, useRef, useState } from 'react'

export const TypingAnimation = ({
  finalText,
  reverse = false,
  onCompleted,
}: {
  finalText: string
  reverse: boolean
  onCompleted?: (reversed: boolean) => void
}) => {
  const [index, setIndex] = useState(reverse ? finalText.length : 0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCompletedRef = useRef(false)

  // Check for completion after each index update
  useEffect(() => {
    const isComplete =
      (!reverse && index === finalText.length) || (reverse && index === 0)

    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true

      // Clear the interval when complete
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Call completion callback
      onCompleted?.(reverse)
    }
  }, [index, reverse, finalText.length, onCompleted])

  // Animation interval
  useEffect(() => {
    hasCompletedRef.current = false

    intervalRef.current = setInterval(() => {
      setIndex(currentIndex => {
        if (!reverse) {
          if (currentIndex < finalText.length) {
            return currentIndex + 1
          }
          return currentIndex
        } else {
          if (currentIndex > 0) {
            return currentIndex - 1
          }
          return currentIndex
        }
      })
    }, 250)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [finalText.length, reverse])

  const currentText = finalText.slice(0, index)

  const shouldFade = index === finalText.length || index === 0

  return (
    <h1 className={`font-light ${shouldFade ? 'text-muted-foreground' : ''}`}>
      {currentText}
    </h1>
  )
}
