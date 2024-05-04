import { Badge } from './ui/badge'

import { type ProgrammingLanguage } from '~/lib/types'

function getLangColorVariants(language: ProgrammingLanguage) {
  switch (language) {
    case 'JavaScript':
      return 'bg-[#F7DF1E] hover:bg-[#D7DF1E]'
    case 'TypeScript':
      return 'bg-[#3178C6] hover:bg-[#007ACC]'
    case 'Python':
      return 'bg-[#3572A5] hover:bg-[#0572A5]'
    case 'Java':
      return 'bg-[#b07219] hover:bg-[#a07219]'
    case 'CSS':
      return 'bg-[#563d7c] hover:bg-[#463d7c]'
    case 'HTML':
      return 'bg-[#e34c26] hover:bg-[#d34c26]'
    case 'Shell':
      return 'bg-[#89e051] hover:bg-[#49e051]'
    case 'C++':
      return 'bg-[#f34b7d] hover:bg-[#b34b7d]'
    case 'Swift':
      return 'bg-[#ffac45] hover:bg-[#dfac45]'
    case 'Ruby':
      return 'bg-[#701516] hover:bg-[#761516]'
    case 'Kotlin':
      return 'bg-[#F18E33] hover:bg-[#F38E33]'
    case 'Makefile':
      return 'bg-[#427819] hover:bg-[#027819]'
    default:
      return '' // Default color if language is not found
  }
}

export const LanguageBadges = ({
  languages,
}: {
  languages: ProgrammingLanguage[]
}) => {
  const langComponents = languages
    .map(language => [language.toString(), getLangColorVariants(language)])
    .map((language, index) => {
      const [name, color] = language
      return (
        <Badge
          key={`${name}-${index}`}
          className={` text-white ${color} hover:animate-pulse hover:cursor-default hover:ring-1 hover:ring-background hover:ring-offset-2`}
        >
          <div className="font-outline-1 relative">
            {name}
            <span className="font-outline-0 absolute left-0" aria-hidden="true">
              {name}
            </span>
          </div>
        </Badge>
      )
    })
  return <>{langComponents}</>
}
