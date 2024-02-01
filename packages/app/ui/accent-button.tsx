import { View } from 'react-native'
import { Typography } from './typography'
import { cn } from './utils'
import { Feather } from '@expo/vector-icons'
import { TextLink } from 'solito/link'

export function AccentLink({ title, href, className = '' }) {
  const defaultClassName = 'flex flex-row items-center text-white gap-1'
  return (
    <TextLink href={href}>
      <View className={cn(defaultClassName, className)}>
        <Typography
          variant="h3"
          className="text-white hover:underline active:underline"
        >
          {title}
        </Typography>
        <Feather name="arrow-right-circle" size={44} color="white" />
      </View>
    </TextLink>
  )
}
