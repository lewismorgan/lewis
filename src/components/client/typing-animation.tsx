'use client'

import { useEffect, useState } from 'react'

export const TypingAnimation = ({ finalText }: { finalText: string }) => {
  const [index, setIndex] = useState(0)
  const [period, setPeriod] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < finalText.length) {
        setIndex(index + 1)
      } else if (index === finalText.length) {
        // do it this way so the period is inserted consistently with the rest of the text
        setPeriod(true)
      } else {
        clearInterval(interval)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [finalText.length, index])

  const currentText = finalText.slice(0, index)
  return (
    <>
      <h1 className="text-left">{currentText}</h1>
      {period && (
        <span className="inline-flex animate-pulse delay-1000">.</span>
      )}
    </>
  )
}
