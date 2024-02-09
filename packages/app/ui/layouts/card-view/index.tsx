import { View } from 'react-native'
import { cn } from 'app/ui/utils'
import { Card, CardProps } from 'app/ui/card'

export type CardViewProps = {
  children: React.ReactNode
  className?: string
  cardProps?: Partial<CardProps>
}

export function CardView({ children, className = '' }: CardViewProps) {
  return (
    <View
      className={cn(
        'web:py-8 web:max-h-[90%] web:max-w-screen flex flex-1 flex-col items-center justify-center md:max-w-screen-sm',
        className
      )}
    >
      <Card>{children}</Card>
    </View>
  )
}
