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
        'mx-4 my-auto basis-10/12 rounded-2xl bg-white px-4 pt-5',
        className
      )}
    >
      {children}
    </View>
  )
}
