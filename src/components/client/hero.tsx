'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { Spiel, type SpielProps } from './spiel'
import { TypingAnimation } from './typing-animation'

export type ForceSide = 'light' | 'dark' | 'none'

export const Hero = ({
  profileImage,
  name,
}: {
  profileImage: string
  name: string
}) => {
  const { theme } = useTheme()
  const [activeForceSide, setActiveSide] = useState<ForceSide>('none')
  const [replayQueued, setReplayQueued] = useState(false)
  const [lizards, setLizards] = useState(false)
  const lizardImgs = ['/lizard.png', '/astro_lizard.png']
  const [lizardsAvatarUrl, setLizardsAvatarUrl] = useState(lizardImgs[0])

  useEffect(() => {
    // resets all the avatar changers to the default when the theme changes; allowed sync because theme updates originate outside component
    setActiveSide('none')
    setLizards(false)
  }, [theme])

  const toggleForceSide = (theme: string | undefined) => {
    switch (theme) {
      case 'light':
        setActiveSide('light')
        break
      case 'dark':
        setActiveSide('dark')
        break
      default:
        setActiveSide('none')
        break
    }
  }

  const getForceSensitiveAvatarUrl = (theme: string) => {
    switch (theme) {
      case 'light':
        return '/grogu.jpg'
      case 'dark':
        return '/anakin.png'
      default:
        return profileImage
    }
  }

  const handleGlowsticksClick = () => {
    if (lizards) setLizards(false)
    toggleForceSide(theme)
  }

  const fsAvatarUrl = getForceSensitiveAvatarUrl(activeForceSide)

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
        setActiveSide('none')
        const nextLizardIndex = Math.random() > 0.5 ? 0 : 1
        setLizardsAvatarUrl(lizardImgs[nextLizardIndex])
      }
      setLizards(prev => !prev)
    },
  } as SpielProps

  const text = 'Hello_Internet'

  return (
    <div className="flex w-full flex-col p-4 align-middle md:p-6">
      <div className="flex h-20 flex-row place-self-center py-4 font-mono text-4xl tracking-tight hover:cursor-default md:h-24 md:py-6 md:text-5xl lg:h-28 lg:text-7xl">
        <TypingAnimation finalText={text} reverse={replayQueued} />
      </div>
      <div className="space-y-4 text-center hover:cursor-default md:space-y-6">
        <div className="text-lg leading-relaxed tracking-tight md:text-xl">
          Welcome to the digital space, domain, and realm of Lewis Morgan
        </div>
        <Spiel {...spielProps} />
      </div>
    </div>
  )
}
