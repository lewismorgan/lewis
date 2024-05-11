'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { ImageProfile } from './image-profile'

type ImageVariations = {
  light: string
  dark: string
}

export type SpielProps = {
  imgName: string
  glowstickImgs: ImageVariations
  defaultImg: string
}

export const Spiel = ({ imgName, glowstickImgs, defaultImg }: SpielProps) => {
  const { theme } = useTheme()

  const [activeMode, setActiveMode] = useState<'light' | 'dark' | 'default'>(
    'default',
  )

  useEffect(() => {
    // resets the activeMode to default when the theme changes
    setActiveMode('default')
  }, [theme])

  const avatarUrl =
    activeMode === 'light'
      ? glowstickImgs.light
      : activeMode === 'dark'
        ? glowstickImgs.dark
        : defaultImg

  const handleGlowsticksClick = () => {
    switch (theme) {
      case 'light':
        activeMode !== 'light'
          ? setActiveMode('light')
          : setActiveMode('default')
        break
      case 'dark':
        activeMode !== 'dark' ? setActiveMode('dark') : setActiveMode('default')
        break
      default:
        setActiveMode('default')
        break
    }
  }
  return (
    <>
      <div>
        You may find a lot of{' '}
        <span className="relative">
          <span className="absolute -inset-0 block -skew-y-6 rounded-full bg-gradient-to-r from-transparent to-blue-400 hover:animate-pulse dark:to-red-800"></span>
          <span
            className="relative font-semibold hover:animate-pulse dark:text-white"
            onClick={handleGlowsticksClick}
          >
            glowsticks
          </span>
        </span>
        ,{' '}
        <span className="text-nowrap tracking-wide text-green-800 underline decoration-wavy decoration-1 underline-offset-2">
          space-lizards
        </span>
        , and lines of <span className="font-mono tracking-wider">code</span>{' '}
        lying around
      </div>
      <div className="mx-auto flex w-full flex-row place-content-center pt-2 align-middle">
        <ImageProfile avatarUrl={avatarUrl} name={imgName} />
      </div>
    </>
  )
}
