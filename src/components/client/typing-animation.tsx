'use client'

import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!reverse) {
        if (index < finalText.length) {
          setIndex(index + 1)
        } else {
          clearInterval(interval)
          onCompleted?.(reverse)
        }
      } else {
        if (index === finalText.length) {
          setIndex(index - 1)
        } else if (index != 0) {
          setIndex(index - 1)
        } else {
          clearInterval(interval)
          onCompleted?.(reverse)
        }
      }
    }, 250)

    return () => clearInterval(interval)
  }, [finalText.length, index, reverse, onCompleted])

  const currentText = finalText.slice(0, index)

  const shouldFade = index === finalText.length || index === 0

  return (
    <h1 className={`font-light ${shouldFade ? 'text-muted-foreground' : ''}`}>
      {currentText}
    </h1>
  )
}
