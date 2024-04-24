import './style.css'

import './tailwind.css'
import type React from 'react'

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans">
      <Content>{children}</Content>
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="w-screen h-screen">{children}</div>
}
