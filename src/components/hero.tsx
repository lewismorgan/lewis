'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { TypingAnimation } from './client/typing-animation'
import { Spiel, type SpielProps } from './spiel'

export type ForceSide = 'light' | 'dark' | 'theme'

export const Hero = ({
  profileImage,
  name,
}: {
  profileImage: string
  name: string
}) => {
  const { theme } = useTheme()
  const [side, setSide] = useState<ForceSide>('theme')
  const [replayQueued, setReplayQueued] = useState(false)

  useEffect(() => {
    // resets the activeMode to default when the theme changes
    setSide('theme')
  }, [theme])

  const handleGlowsticksClick = () => {
    switch (theme) {
      case 'light':
        side !== 'light' ? setSide('light') : setSide('theme')
        break
      case 'dark':
        side !== 'dark' ? setSide('dark') : setSide('theme')
        break
      default:
        setSide('theme')
        break
    }
  }

  const avatarUrl =
    side === 'light'
      ? '/grogu.jpg'
      : side === 'dark'
        ? '/anakin.png'
        : profileImage

  const spielProps = {
    imgName: name,
    avatarUrl,
    onGlowsticksClick: handleGlowsticksClick,
    onCodeClick: () => {
      setReplayQueued(!replayQueued)
    },
  } as SpielProps

  const text = 'Hello_Internet'

  return (
    <div className="flex w-full flex-col p-1 align-middle">
      <div className="flex h-16 flex-row place-self-center py-4 font-mono text-4xl tracking-tight hover:cursor-default md:h-20 md:text-5xl lg:h-24 lg:text-7xl">
        <TypingAnimation finalText={text} reverse={replayQueued} />
      </div>
      <div className="space-y-2 text-center hover:cursor-default">
        <div className="text-lg tracking-tight">
          Welcome to the digital space, domain, and realm of Lewis Morgan
        </div>
        <Spiel {...spielProps} />
      </div>
    </div>
  )
}
