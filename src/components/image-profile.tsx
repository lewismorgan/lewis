import Image from 'next/image'

type Props = {
  avatarUrl: string
  name: string
}

export const ImageProfile = ({ avatarUrl, name }: Props) => {
  return (
    <div className="block h-[128] w-[128] flex-shrink overflow-clip rounded-full border-2 border-foreground shadow-2xl lg:h-[296] lg:w-[296]">
      <Image className="" width={296} height={296} src={avatarUrl} alt={name} />
    </div>
  )
}
