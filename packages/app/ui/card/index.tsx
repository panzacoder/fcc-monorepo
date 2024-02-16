import { View } from 'react-native'
import { cn } from 'app/ui/utils'

export type CardProps = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={cn(
        'bg-card flex flex-shrink rounded-2xl px-6 pb-1 pt-5',
        className
      )}
    >
      {children}
    </View>
  )
}
