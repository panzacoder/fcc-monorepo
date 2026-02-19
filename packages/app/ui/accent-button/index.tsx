import { TouchableOpacity } from 'react-native'
import { Feather } from 'app/ui/icons'

import { Typography } from 'app/ui/typography'
import { cn } from 'app/ui/utils'

export function AccentButton({ title, onPress, className = '' }) {
  const defaultClassName = 'flex flex-row items-center text-white gap-1 group'
  return (
    <TouchableOpacity
      onPress={onPress}
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
        onPress={onPress}
        name="arrow-right-circle"
        size={44}
        color="white"
        className="group"
      />
    </TouchableOpacity>
  )
}
