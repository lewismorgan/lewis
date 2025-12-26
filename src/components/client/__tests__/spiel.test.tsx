import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Spiel, type SpielProps } from '~/components/client/spiel'

// Mock next/image to a simple <img>. The real Next Image has complex props
// and loaders not needed for unit tests, so we safely use `any` here.
/* eslint-disable @next/next/no-img-element */
interface MockImageProps {
  alt: string
  src: string
  width?: number
  height?: number
  className?: string
}

vi.mock('next/image', () => ({
  default: (props: MockImageProps) => <img alt={props.alt} src={props.src} width={props.width} height={props.height} className={props.className} />,
}))

describe('Spiel Component', () => {
  const baseProps = {
    imgName: 'Lewis Morgan',
    avatarUrl: '/avatar.jpg',
  } satisfies Pick<SpielProps, 'imgName' | 'avatarUrl'>

  it('renders descriptive text and clickable keywords', () => {
    render(
      <Spiel
        {...baseProps}
        onGlowsticksClick={vi.fn()}
        onLizardsClick={vi.fn()}
        onCodeClick={vi.fn()}
      />,
    )

    expect(screen.getByText(/You may find a lot of/i)).toBeInTheDocument()
    expect(screen.getByText(/glowsticks/i)).toBeInTheDocument()
    expect(screen.getByText(/space-lizards/i)).toBeInTheDocument()
    expect(screen.getByText(/code/i)).toBeInTheDocument()
  })

  it('renders the ImageProfile with provided name and avatar', () => {
    render(
      <Spiel
        {...baseProps}
        onGlowsticksClick={vi.fn()}
        onLizardsClick={vi.fn()}
        onCodeClick={vi.fn()}
      />,
    )

    const avatar = screen.getByAltText(baseProps.imgName)
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', baseProps.avatarUrl)
  })

  it('invokes onGlowsticksClick when "glowsticks" is clicked', async () => {
    const user = userEvent.setup()
    const onGlowsticksClick = vi.fn()

    render(
      <Spiel
        {...baseProps}
        onGlowsticksClick={onGlowsticksClick}
        onLizardsClick={vi.fn()}
        onCodeClick={vi.fn()}
      />,
    )

    await user.click(screen.getByText(/glowsticks/i))
    expect(onGlowsticksClick).toHaveBeenCalledTimes(1)
  })

  it('invokes onLizardsClick when "space-lizards" is clicked', async () => {
    const user = userEvent.setup()
    const onLizardsClick = vi.fn()

    render(
      <Spiel
        {...baseProps}
        onGlowsticksClick={vi.fn()}
        onLizardsClick={onLizardsClick}
        onCodeClick={vi.fn()}
      />,
    )

    await user.click(screen.getByText(/space-lizards/i))
    expect(onLizardsClick).toHaveBeenCalledTimes(1)
  })

  it('invokes onCodeClick when "code" is clicked', async () => {
    const user = userEvent.setup()
    const onCodeClick = vi.fn()

    render(
      <Spiel
        {...baseProps}
        onGlowsticksClick={vi.fn()}
        onLizardsClick={vi.fn()}
        onCodeClick={onCodeClick}
      />,
    )

    await user.click(screen.getByText(/code/i))
    expect(onCodeClick).toHaveBeenCalledTimes(1)
  })
})
