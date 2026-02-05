'use client'

import React from 'react'

import { useSearchParams } from 'next/navigation'

import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props

export const SlowModeContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const searchParams = useSearchParams()

  const paramSlowMode = searchParams.get('slowmode') === 'true'

  const toggleSlowMode = () => {
    // This way of updating the URL is not ideal, but it works due to SSR caches
    const params = new URLSearchParams(searchParams.toString())
    params.set('slowmode', String(!paramSlowMode))
    window.history.pushState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  return (
    <>
      <div
        className="ml-auto flex items-center space-x-2 pr-4"
        data-testid="slow-mode-container"
      >
        <Switch
          id="slow-mode"
          defaultChecked={paramSlowMode}
          onClick={() => toggleSlowMode()}
        />
        <Label htmlFor="slow-mode">Slow Mode</Label>
      </div>
      {children}
    </>
  )
}
