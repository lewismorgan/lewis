import { TypingAnimation } from './client/typing-animation'
import { Spiel, type SpielProps } from './spiel'

export const Hero = ({
  profileImage,
  name,
}: {
  profileImage: string
  name: string
}) => {
  const spielProps = {
    imgName: name,
    glowstickImgs: { light: '/grogu.jpg', dark: '/anakin.png' },
    defaultImg: profileImage,
  } as SpielProps

  return (
    <div className="flex w-full flex-col p-1 align-middle">
      <div className="flex h-16 flex-row place-self-center py-4 font-mono text-4xl tracking-tight hover:cursor-default md:h-20 md:text-5xl lg:h-24 lg:text-7xl">
        <TypingAnimation finalText="Hello_Internet" />
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
