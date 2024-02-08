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
        'mx-4 my-auto rounded-2xl bg-white px-4 pt-5 md:w-full md:max-w-md',
        className
      )}
    >
      {children}
    </View>
  )
}
