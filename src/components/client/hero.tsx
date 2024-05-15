'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { Spiel, type SpielProps } from './spiel'
import { TypingAnimation } from './typing-animation'

export type ForceSide = 'light' | 'dark' | 'theme'

export const Hero = ({
  profileImage,
  name,
}: {
  profileImage: string
  name: string
}) => {
  const { theme } = useTheme()
  const [activeForceSide, setActiveSide] = useState<ForceSide>('theme')
  const [replayQueued, setReplayQueued] = useState(false)
  const [lizards, setLizards] = useState(false)

  useEffect(() => {
    // resets all the avatar changers to the default when the theme changes
    setActiveSide('theme')
    setLizards(false)
  }, [theme])

  const handleGlowsticksClick = () => {
    if (lizards) setLizards(false)
    switch (theme) {
      case 'light':
        activeForceSide !== 'light'
          ? setActiveSide('light')
          : setActiveSide('theme')
        break
      case 'dark':
        activeForceSide !== 'dark'
          ? setActiveSide('dark')
          : setActiveSide('theme')
        break
      default:
        setActiveSide('theme')
        break
    }
  }

  const fsAvatarUrl =
    activeForceSide === 'light'
      ? '/grogu.jpg'
      : activeForceSide === 'dark'
        ? '/anakin.png'
        : profileImage

  const lizardImgs = ['/lizard.png', '/astro_lizard.png']

  const lizardsAvatarUrl = lizardImgs[Math.random() > 0.5 ? 0 : 1]

  const spielProps = {
    imgName: name,
    avatarUrl: lizards ? lizardsAvatarUrl : fsAvatarUrl,
    onGlowsticksClick: handleGlowsticksClick,
    onCodeClick: () => {
      setReplayQueued(!replayQueued)
    },
    onLizardsClick: () => {
      if (!lizards) {
        // reset the force side to default before lizards are shown
        setActiveSide('theme')
      }
      setLizards(!lizards)
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
