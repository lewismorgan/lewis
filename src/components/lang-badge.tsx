import { Badge } from './ui/badge'

import { type ProgrammingLanguage } from '~/lib/types'

function getLangColorVariants(language: ProgrammingLanguage) {
  switch (language) {
    case 'JavaScript':
      return 'bg-[#F7DF1E] hover:bg-[#E7CF0E] dark:bg-[#F7DF1E] dark:hover:bg-[#E7CF0E] text-black dark:text-black'
    case 'TypeScript':
      return 'bg-[#3178C6] hover:bg-[#2868B6] dark:bg-[#3178C6] dark:hover:bg-[#2868B6] text-white dark:text-white'
    case 'Python':
      return 'bg-[#3572A5] hover:bg-[#2862A5] dark:bg-[#4B8BBE] dark:hover:bg-[#3B7BAE] text-white dark:text-white'
    case 'Java':
      return 'bg-[#b07219] hover:bg-[#a06219] dark:bg-[#f89820] dark:hover:bg-[#e88810] text-white dark:text-black'
    case 'CSS':
      return 'bg-[#563d7c] hover:bg-[#462d6c] dark:bg-[#744CBC] dark:hover:bg-[#643CAC] text-white dark:text-white'
    case 'HTML':
      return 'bg-[#e34c26] hover:bg-[#d33c16] dark:bg-[#e44d26] dark:hover:bg-[#d43d16] text-white dark:text-white'
    case 'Shell':
      return 'bg-[#89e051] hover:bg-[#79d041] dark:bg-[#89e051] dark:hover:bg-[#79d041] text-black dark:text-black'
    case 'C++':
      return 'bg-[#f34b7d] hover:bg-[#e33b6d] dark:bg-[#f34b7d] dark:hover:bg-[#e33b6d] text-white dark:text-white'
    case 'Swift':
      return 'bg-[#ffac45] hover:bg-[#ef9c35] dark:bg-[#ffac45] dark:hover:bg-[#ef9c35] text-black dark:text-black'
    case 'Ruby':
      return 'bg-[#701516] hover:bg-[#601516] dark:bg-[#CC342D] dark:hover:bg-[#BC241D] text-white dark:text-white'
    case 'Kotlin':
      return 'bg-[#F18E33] hover:bg-[#E17E23] dark:bg-[#F18E33] dark:hover:bg-[#E17E23] text-black dark:text-black'
    case 'Makefile':
      return 'bg-[#427819] hover:bg-[#326809] dark:bg-[#6D9E32] dark:hover:bg-[#5D8E22] text-white dark:text-white'
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
          className={`${color} hover:ring-background hover:animate-pulse hover:cursor-default hover:ring-1 hover:ring-offset-2`}
          data-testid={`lang-badge`}
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
