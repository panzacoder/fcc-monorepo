import { View } from 'react-native'
import { cn } from 'app/ui/utils'
import { Card, CardProps } from 'app/ui/card'

export type CardViewProps = {
  children: React.ReactNode
  className?: string
  cardProps?: CardProps
}

export function CardView({ children, className = '' }: CardViewProps) {
  return (
    <View
      className={cn(
        'flex h-screen w-screen items-center justify-center',
        className
      )}
    >
      <Card>{children}</Card>
    </View>
  )
}
