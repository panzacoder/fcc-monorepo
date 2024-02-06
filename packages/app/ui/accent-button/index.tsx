import { Pressable } from 'react-native'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'solito/navigation'

import { Typography } from 'app/ui/typography'
import { cn } from 'app/ui/utils'

export function AccentButton({ title, href, className = '' }) {
  const defaultClassName = 'flex flex-row items-center text-white gap-1 group'
  const router = useRouter()
  return (
    <Pressable
      onPress={() => router.push(href)}
      className={cn(defaultClassName, className)}
    >
      <Typography
        variant="h3"
        as="span"
        className="text-white group-hover:underline group-active:underline"
      >
        {title}
      </Typography>
      <Feather
        name="arrow-right-circle"
        size={44}
        color="white"
        className="group"
      />
    </Pressable>
  )
}
