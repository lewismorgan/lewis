import type React from 'react'

import { ThemeProvider } from '@/components/theme-provider'

import './style.css'
import './tailwind.css'

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans dark">
      <Content>{children}</Content>
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="w-screen h-screen">{children}</div>
}
