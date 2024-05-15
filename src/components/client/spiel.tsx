'use client'

import { ImageProfile } from '../image-profile'

export type SpielProps = {
  imgName: string
  avatarUrl: string
  onGlowsticksClick?: () => void
  onLizardsClick?: () => void
  onCodeClick?: () => void
}

export const Spiel = ({
  imgName,
  avatarUrl,
  onGlowsticksClick,
  onLizardsClick,
  onCodeClick,
}: SpielProps) => {
  return (
    <>
      <div>
        You may find a lot of{' '}
        <span className="relative">
          <span className="absolute -inset-0 block -skew-y-6 rounded-full bg-gradient-to-r from-transparent to-blue-400 hover:animate-pulse dark:to-red-800"></span>
          <span
            className="relative font-semibold hover:animate-pulse hover:cursor-pointer dark:text-white"
            onClick={onGlowsticksClick}
          >
            glowsticks
          </span>
        </span>
        ,{' '}
        <span
          className="text-nowrap tracking-wide text-green-800 underline decoration-wavy decoration-1 underline-offset-2 hover:cursor-pointer"
          onClick={onLizardsClick}
        >
          space-lizards
        </span>
        , and lines of{' '}
        <span
          className="font-mono tracking-wider hover:animate-pulse hover:cursor-pointer"
          onClick={onCodeClick}
        >
          code
        </span>{' '}
        lying around
      </div>
      <div className="mx-auto flex w-full flex-row place-content-center pt-2 align-middle">
        <ImageProfile avatarUrl={avatarUrl} name={imgName} />
      </div>
    </>
  )
}
